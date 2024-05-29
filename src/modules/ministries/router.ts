const Module = () => import('./Module.vue')

const Ministries = () => import('./pages/Ministries.vue')

const moduleRoute = {
  path: '/ministries',
  meta: { role: 'MINISTRIES' },
  component: Module,
  children: [
    {
      path: '',
      name: 'MINISTRIES',
      meta: { role: 'MINISTRIES' },
      component: Ministries
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
