import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import DivisionPage from './pages/DivisionPage'
import EngagementPage from './pages/EngagementPage'
import { notFoundPage, publicPages } from './content/pages'

const path = window.location.pathname.replace(/\/+$/, '') || '/'
const match = path.match(/^\/expertise\/(finance|it|cyber|digital)$/)

const page = publicPages.find(item => item.path === (path === '/' ? path : `${path}/`))
document.title = (page ?? notFoundPage).title

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {path === '/'
      ? <App />
      : path === '/contact' || path === '/privacy'
        ? <EngagementPage privacy={path === '/privacy'} />
        : <DivisionPage id={match?.[1] ?? ''} />}
  </StrictMode>,
)
