const Module = () => import('./Module.vue')

const KindOfActivity = () => import('./pages/KindOfActivity.vue')

const moduleRoute = {
  path: '/kind-of-activity',
  meta: { role: 'KIND_OF_ACTIVITY' },
  component: Module,
  children: [
    {
      path: '',
      name: 'KIND_OF_ACTIVITY',
      meta: { role: 'KIND_OF_ACTIVITY' },
      component: KindOfActivity
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
