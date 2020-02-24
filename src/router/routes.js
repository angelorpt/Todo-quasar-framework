
const routes = [
  {
    path: '/todo',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/todo', component: () => import('pages/Todo.vue') },
      { path: '/help', component: () => import('pages/Help.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/Login.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
