const Module = () => import('./Module.vue')

const GovernmentOrganizations = () => import('./pages/GovernmentOrganizations.vue')

const moduleRoute = {
  path: '/government-organizations',
  meta: { role: 'GOVERNMENT_ORGANIZATION' },
  component: Module,
  children: [
    {
      path: '',
      name: 'GOVERNMENT_ORGANIZATION',
      meta: { role: 'GOVERNMENT_ORGANIZATION' },
      component: GovernmentOrganizations
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
