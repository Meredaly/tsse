const Module = () => import('./Module.vue')

const JobTitle = () => import('./pages/JobTitle.vue')
const Users = () => import('./pages/Users.vue')

const moduleRoute = {
  path: '/user-settings',
  meta: { role: 'USER_SETTINGS' },
  component: Module,
  redirect: { path: '/user-settings/job-title' },
  children: [
    {
      path: 'job-title',
      name: 'USER_SETTINGS',
      meta: { role: 'USER_SETTINGS' },
      component: JobTitle
    },
    {
      path: 'users',
      meta: { role: 'USER_SETTINGS' },
      component: Users
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
