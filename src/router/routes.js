
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/index') },
      { path: '/git_status', component: () => import('pages/git-status') },
      { path: '/pull', component: () => import('pages/pull') },
      { path: '/push', component: () => import('pages/push') },
      { path: '/commit', component: () => import('pages/commit') },
      { path: '/apply', component: () => import('pages/apply') },
      { path: '/setup', component: () => import('pages/setup') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
