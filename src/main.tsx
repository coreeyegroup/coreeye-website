import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import DivisionPage from './pages/DivisionPage'

const path = window.location.pathname.replace(/\/+$/, '') || '/'
const match = path.match(/^\/expertise\/(finance|it|cyber|digital)$/)

document.title = match
  ? `Core Eye ${{ finance: "Finance", it: "IT", cyber: "Cyber", digital: "Digital" }[match[1]] ?? match[1]} — Expertise`
  : path === '/'
  ? 'Core Eye Group — Private Institutional Stewardship'
  : 'Page not found — Core Eye Group'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {path === '/'
      ? <App />
      : <DivisionPage id={match?.[1] ?? ''} />}
  </StrictMode>,
)
