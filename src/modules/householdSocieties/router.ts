const Module = () => import('./Module.vue')

const HouseholdSocieties = () => import('./pages/HouseholdSocieties.vue')

const moduleRoute = {
  path: '/household-societies',
  meta: { role: 'HOUSEHOLD_SOCIETIES' },
  component: Module,
  children: [
    {
      path: '',
      name: 'HOUSEHOLD_SOCIETIES',
      meta: { role: 'HOUSEHOLD_SOCIETIES' },
      component: HouseholdSocieties
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
