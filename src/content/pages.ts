import { divisions } from './company.ts'

export const siteOrigin = 'https://coreeyegroup.com'

export const publicPages = [
  {
    path: '/',
    title: 'Core Eye Group | Private Strategic Intelligence & Technology',
    description: 'Core Eye Group brings together Financial Capital, Technology Infrastructure, Cyber Intelligence and Digital Authority for institutions, family offices and private principals.',
  },
  ...divisions.map(division => ({
    path: `/expertise/${division.id}/`,
    title: `${division.capability} | Core Eye Group`,
    description: division.summary,
  })),
  {
    path: '/contact/',
    title: 'Private Engagement & Enquiries | Core Eye Group',
    description: 'Contact Core Eye Group about a private institutional requirement, a cross-disciplinary mandate or a strategic partnership.',
  },
  {
    path: '/privacy/',
    title: 'Enquiry Privacy | Core Eye Group',
    description: 'What Core Eye Group collects through its enquiry form and how those details are used to review and respond to an enquiry.',
  },
]

export const notFoundPage = {
  title: 'Page Not Found | Core Eye Group',
  description: 'The requested page could not be found. Return to Core Eye Group or contact us about a private engagement.',
}
