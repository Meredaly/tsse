import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuth } from '@/store/auth'

const routes: Array<RouteRecordRaw> = []

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  from

  const auth = useAuth()
  if (to.path === '/login') {
    next()
    return
  }

  if (!auth.isAuth) {
    await auth.getProfile()
  }
  if (to.meta?.role === 'STATS' && !auth.getRoles.includes('STATS')) {
    next({ name: auth.getRoles[0] })
    return
  }
  if (to.meta?.role && !auth.getRoles.includes(to.meta.role as string)) {
    next('/login')
    return
  }
  next()
})
export default router
