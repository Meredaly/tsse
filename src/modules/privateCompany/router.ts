const Module = () => import('./Module.vue')

const PrivacyCompanies = () => import('./pages/PrivacyCompanies.vue')

const moduleRoute = {
  path: '/private-companies',
  meta: { role: 'PRIVATE_COMPANIES' },
  component: Module,
  children: [
    {
      path: '',
      name: 'PRIVATE_COMPANIES',
      meta: { role: 'PRIVATE_COMPANIES' },
      component: PrivacyCompanies
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
