const Module = () => import('./Module.vue')

const Home = () => import('./pages/Home.vue')

const moduleRoute = {
  path: '/',
  meta: { role: 'STATS' },
  component: Module,
  children: [
    {
      path: '',
      name: 'STATS',
      meta: { role: 'STATS' },
      component: Home
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
