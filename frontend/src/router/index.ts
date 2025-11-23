import { h } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

enum RouteNames {
  APP_VIEW = 'AppView',
  HOME = 'HomePage',
  SHOP = 'ShopPage',
  AUTH = 'AuthPage',
  NOT_FOUND = "NotFoundPage",
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: RouteNames.AUTH,
      path: '/auth',
      component: () => import('../pages/AuthPage.vue'),
    },
    {
      name: RouteNames.APP_VIEW,
      path: '/',
      component: () => import('../layout/AppView.vue'),
      redirect: { name: RouteNames.HOME },
      children: [
        {
          name: RouteNames.HOME,
          path: 'home',
          component: () => import('../pages/HomePage.vue'),
        },
        {
          name: RouteNames.SHOP,
          path: 'shop',
          component: () => import('../pages/ShopPage.vue'),
        },
      ],
    },
    {
      name: RouteNames.NOT_FOUND,
      path: '/:pathMatch(.*)*',
      component: () => h('div', 'Are you lost? Page not found.'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const sessionToken = localStorage.getItem('session_token')
  const userId = localStorage.getItem('user_id')
  const isAuthenticated = !!(sessionToken && userId)

  if (!isAuthenticated && to.name !== RouteNames.AUTH) {
    next({ name: RouteNames.AUTH })
  } else if (isAuthenticated && to.name === RouteNames.AUTH) {
    next({ name: RouteNames.HOME })
  } else {
    next()
  }
})

export default router
