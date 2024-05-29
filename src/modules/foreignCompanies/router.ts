const Module = () => import('./Module.vue')

const ForeignCompanies = () => import('./pages/ForeignCompanies.vue')

const moduleRoute = {
  path: '/foreign-companies',
  meta: { role: 'FOREIGN_COMPANIES' },
  component: Module,
  children: [
    {
      path: '',
      name: 'FOREIGN_COMPANIES',
      meta: { role: 'FOREIGN_COMPANIES' },
      component: ForeignCompanies
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
