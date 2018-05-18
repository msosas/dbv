
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/index') },
      { path: '/git_status', component: () => import('pages/git-status') },
      { path: '/pull', component: () => import('pages/pull') },
      { path: '/commit', component: () => import('pages/commit') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
