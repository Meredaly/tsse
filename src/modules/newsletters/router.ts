const Module = () => import('./Module.vue')

const Newsletters = () => import('./pages/Newsletters.vue')
const Newsletter = () => import('./pages/Newsletter.vue')
const NewsletterPreview = () => import('./pages/NewsletterPreview.vue')

const moduleRoute = {
  path: '/newsletters',
  meta: { role: 'NEWSLETTERS' },
  component: Module,
  children: [
    {
      path: '',
      name: 'NEWSLETTERS',
      meta: { role: 'NEWSLETTERS' },
      component: Newsletters
    },
    {
      path: 'newsletter/:id',
      meta: { role: 'NEWSLETTERS' },
      component: Newsletter
    },
    {
      path: 'newsletter-preview/:id',
      meta: { role: 'NEWSLETTERS' },
      component: NewsletterPreview
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
