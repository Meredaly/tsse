const Module = () => import('./Module.vue')

const Country = () => import('./pages/Country.vue')
const Region = () => import('./pages/Region.vue')

const moduleRoute = {
  path: '/localization',
  meta: { role: 'LOCALIZATION' },
  name: 'LOCALIZATION',
  component: Module,
  redirect: { path: '/localization/county' },
  children: [
    {
      path: 'county',
      meta: { role: 'LOCALIZATION' },
      component: Country
    },
    {
      path: 'region',
      meta: { role: 'LOCALIZATION' },
      component: Region
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
