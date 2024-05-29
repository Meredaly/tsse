const Module = () => import('./Module.vue')

const Members = () => import('./pages/Members.vue')
const Member = () => import('./pages/Member.vue')
const MemberPreview = () => import('./pages/MemberPreview.vue')

const moduleRoute = {
  path: '/members',
  component: Module,
  meta: { role: 'MEMBERS' },
  children: [
    {
      path: '',
      name: 'MEMBERS',
      meta: { role: 'MEMBERS' },
      component: Members
    },
    {
      path: 'member/:id',
      meta: { role: 'MEMBERS' },
      component: Member
    },
    {
      path: 'preview/:id',
      meta: { role: 'MEMBERS' },
      component: MemberPreview
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
