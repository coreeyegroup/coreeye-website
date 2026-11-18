import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import './IntroductionForm.css'

export default function IntroductionForm({
  initialInterest = '',
}: {
  initialInterest?: string
}) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [reference, setReference] = useState('')
  const submitting = useRef(false)
  const secure = window.location.protocol === 'https:'

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!secure || submitting.current) return

    const form = event.currentTarget
    if (!form.reportValidity()) return

    const data = new FormData(form)
    const payload = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      organisation: String(data.get('organisation') ?? '').trim(),
      interest: String(data.get('interest') ?? ''),
      message: String(data.get('message') ?? '').trim(),
      website: String(data.get('website') ?? ''),
      consent: data.get('consent') === 'on',
    }

    if (payload.name.length < 2 || payload.message.length < 20) {
      setError('Enter your name and a brief requirement of at least 20 characters.')
      return
    }

    submitting.current = true
    setPending(true)
    setError('')

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      })

      const result = await response.json().catch(() => null)

      if (!response.ok || result?.ok !== true || typeof result.reference !== 'string') {
        throw new Error(
          typeof result?.error === 'string'
            ? result.error
            : 'Submission could not be confirmed. Please contact us by email.',
        )
      }

      setReference(result.reference)
      form.reset()
    } catch (failure) {
      setError(
        failure instanceof TypeError
          ? 'Submission could not be confirmed. Please contact us before submitting again.'
          : failure instanceof Error
          ? failure.message
          : 'Submission could not be confirmed.',
      )
    } finally {
      submitting.current = false
      setPending(false)
    }
  }

  if (reference) {
    return (
      <div className="introduction-success" role="status">
        <h3>Your introduction has been submitted.</h3>
        <p>Thank you for outlining your requirement. The details have been
          forwarded to our enquiry mailbox for review.</p>
        <p className="introduction-reference">Reference: {reference}</p>
        <p>Submission does not establish an engagement. Scope and suitability
          are considered before a mandate is agreed.</p>
      </div>
    )
  }

  return (
    <form className="introduction-form" onSubmit={submit} aria-busy={pending}>
      <p className="introduction-context">
        Share your contact details and a short outline of the responsibility
        requiring attention. Please exclude sensitive documents, account
        credentials and detailed security information.
      </p>

      {!secure && (
        <p className="introduction-notice" role="status">
          This development preview does not accept enquiries over HTTP.
          Submission will be available through the HTTPS website.
        </p>
      )}

      <fieldset disabled={pending}>
        <div className="introduction-fields">
          <label htmlFor="intro-name">Full name
            <input id="intro-name" name="name" autoComplete="name"
              required minLength={2} maxLength={100} />
          </label>

          <label htmlFor="intro-email">Email address
            <input id="intro-email" name="email" type="email"
              autoComplete="email" required maxLength={254} />
          </label>

          <label htmlFor="intro-organisation">Organisation <span>(optional)</span>
            <input id="intro-organisation" name="organisation"
              autoComplete="organization" maxLength={150} />
          </label>

          <label htmlFor="intro-interest">Area of interest
            <select id="intro-interest" name="interest" required defaultValue={initialInterest}>
              <option value="" disabled>Select an area</option>
              {['Finance', 'IT', 'Cyber', 'Digital', 'Integrated requirement', 'Other']
                .map(area => <option key={area} value={area}>{area}</option>)}
            </select>
          </label>
        </div>

        <label htmlFor="intro-message">Brief outline of your requirement
          <textarea id="intro-message" name="message" required
            minLength={20} maxLength={3000} rows={4}
            aria-describedby="intro-message-help" />
        </label>

        <p id="intro-message-help" className="introduction-help">
          20–3,000 characters. A general description is sufficient.
        </p>

        <div className="introduction-trap" aria-hidden="true">
          <label htmlFor="intro-website">Leave this field empty</label>
          <input id="intro-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <label className="introduction-consent" htmlFor="intro-consent">
          <input id="intro-consent" name="consent" type="checkbox" required />
          <span>I agree that Core Eye Group may use the details provided
            to review and respond to this enquiry.</span>
        </label>

        {error && <p className="introduction-error" role="alert">{error}</p>}

        <button className="button dark-button" type="submit" disabled={!secure}>
          {pending ? 'Submitting…' : 'Submit private introduction ↗'}
        </button>
      </fieldset>

      <p className="introduction-help">
        Alternatively, email{' '}
        <a href="mailto:contact@coreeyegroup.com">contact@coreeyegroup.com</a>.
      </p>
    </form>
  )
}
