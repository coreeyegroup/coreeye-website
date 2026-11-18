import http from 'node:http'
import fs from 'node:fs'
import { randomUUID } from 'node:crypto'
import nodemailer from 'nodemailer'

const config = JSON.parse(
  fs.readFileSync('/home/coreeye/.config/coreeyegroup/mail.json', 'utf8')
)

const mail = nodemailer.createTransport({
  host: config.host,
  port: config.port,
  secure: config.secure,
  auth: { user: config.user, pass: config.password },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
})

const origins = new Set([
  'https://preview.coreeyegroup.com',
  'https://coreeyegroup.com',
  'https://www.coreeyegroup.com',
])

const subjects = new Set([
  'Finance', 'IT', 'Cyber', 'Digital', 'Integrated requirement', 'Other',
])

const attempts = new Map()
let globalWindow = Date.now()
let globalCount = 0
let inFlight = 0

function reply(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  })
  res.end(JSON.stringify(body))
}

function reject(status, message) {
  return Object.assign(new Error(message), { status })
}

async function readBody(req) {
  let size = 0
  const chunks = []
  for await (const chunk of req) {
    size += chunk.length
    if (size > 12000) throw reject(413, 'Enquiry is too large.')
    chunks.push(chunk)
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw reject(400, 'Invalid enquiry format.')
  }
}

function text(value, minimum, maximum, multiline = false) {
  if (typeof value !== 'string') return null
  const clean = value.trim()
  if (clean.length < minimum || clean.length > maximum) return null
  const invalid = multiline
    ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/
    : /[\u0000-\u001f\u007f]/
  return invalid.test(clean) ? null : clean
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/health' && req.method === 'GET') {
    return reply(res, 200, { status: 'ok' })
  }

  if (req.url !== '/api/enquiries') {
    return reply(res, 404, { error: 'Not found.' })
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return reply(res, 405, { error: 'Method not allowed.' })
  }

  if (!origins.has(req.headers.origin)) {
    return reply(res, 403, { error: 'Submission origin is not permitted.' })
  }

  if (req.headers['content-type']?.split(';')[0].trim() !== 'application/json') {
    return reply(res, 415, { error: 'JSON content is required.' })
  }

  try {
    const now = Date.now()
    if (now - globalWindow >= 3600000) {
      globalWindow = now
      globalCount = 0
    }

    if (globalCount >= 30 || inFlight >= 3) {
      throw reject(429, 'Please try again later.')
    }

    const body = await readBody(req)
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw reject(400, 'Invalid enquiry format.')
    }

    if (body.website) {
      throw reject(400, 'Unable to accept this submission.')
    }

    const name = text(body.name, 2, 100)
    const email = text(body.email, 5, 254)
    const organisation = text(body.organisation ?? '', 0, 150)
    const message = text(body.message, 20, 3000, true)

    if (
      !name || !email ||
      !/^[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+$/.test(email) ||
      organisation === null || !message ||
      !subjects.has(body.interest) || body.consent !== true
    ) {
      throw reject(400, 'Check the required fields and submission acknowledgement.')
    }

    for (const [key, value] of attempts) {
      if (value.until <= now) attempts.delete(key)
    }

    const key = email.toLowerCase()
    const entry = attempts.get(key) ?? { count: 0, until: now + 900000 }
    if (entry.count >= 3) {
      throw reject(429, 'Please wait before submitting another enquiry.')
    }

    entry.count++
    attempts.set(key, entry)
    globalCount++
    inFlight++

    const reference = randomUUID()
    try {
      const result = await mail.sendMail({
        from: { name: 'Core Eye Group Website', address: config.from },
        to: config.to,
        replyTo: { address: email },
        subject: `Website introduction — ${body.interest}`,
        text: [
          'PRIVATE INTRODUCTION REQUEST',
          `Reference: ${reference}`,
          `Received: ${new Date().toISOString()}`,
          '',
          `Name: ${name}`,
          `Email: ${email}`,
          `Organisation: ${organisation || 'Not provided'}`,
          `Area of interest: ${body.interest}`,
          '',
          'Enquiry:',
          message,
          '',
          'The sender acknowledged use of these details to respond to this enquiry.',
          'Website submission content is supplied by the visitor.',
        ].join('\n'),
        disableFileAccess: true,
        disableUrlAccess: true,
      })

      if (!result.accepted?.length || result.rejected?.length) {
        throw new Error('RECIPIENT_NOT_ACCEPTED')
      }

      console.log(JSON.stringify({ event: 'enquiry_accepted', reference }))
      return reply(res, 200, { ok: true, reference })
    } finally {
      inFlight--
    }
  } catch (error) {
    if (error.status) {
      return reply(res, error.status, { error: error.message })
    }
    console.error(JSON.stringify({
      event: 'enquiry_failed',
      code: error.code ?? 'DELIVERY_ERROR',
    }))
    return reply(res, 503, {
      error: 'Your enquiry could not be submitted. Please try again later.',
    })
  }
})

server.requestTimeout = 20000
server.headersTimeout = 10000
server.timeout = 45000

server.on('error', error => {
  console.error('Enquiry server failed:', error.code ?? 'UNKNOWN')
  process.exit(1)
})

server.listen(3107, '127.0.0.1', () => {
  console.log('Enquiry service listening on 127.0.0.1:3107')
})

process.on('SIGTERM', () => {
  server.close(() => {
    mail.close()
    process.exit(0)
  })
  setTimeout(() => process.exit(1), 30000).unref()
})
