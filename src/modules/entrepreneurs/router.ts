const Module = () => import('./Module.vue')

const Entrepreneurs = () => import('./pages/Entrepreneurs.vue')

const moduleRoute = {
  path: '/entrepreneurs',
  meta: { role: 'ENTREPRENEURS' },
  component: Module,
  children: [
    {
      path: '',
      name: 'ENTREPRENEURS',
      meta: { role: 'ENTREPRENEURS' },
      component: Entrepreneurs
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
