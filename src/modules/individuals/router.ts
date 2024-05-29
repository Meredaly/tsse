const Module = () => import('./Module.vue')

const Individuals = () => import('./pages/Individuals.vue')

const moduleRoute = {
  path: '/individuals',
  meta: { role: 'INDIVIDUALS' },
  component: Module,
  children: [
    {
      path: '',
      name: 'INDIVIDUALS',
      meta: { role: 'INDIVIDUALS' },
      component: Individuals
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
