import Layout from '@/pages/Layout';

export default [
  {
    path: '/pci/projects/:projectId/local-zones/instances',
    element: <Layout />,
    children: [
      {
        path: '',
        lazy: () => import('@/pages/ListingPage'),
        children: [
          {
            path: 'backup',
            element: 'Create a backup',
          },
          {
            path: 'boot',
            lazy: () => import('@/pages/BootPage'),
          },
          {
            path: 'stop',
            element: 'Stop',
          },
          {
            path: 'soft-reboot',
            element: 'Hot reboot',
          },
          {
            path: 'hard-reboot',
            element: 'Cold reboot',
          },
          {
            path: 'delete',
            element: 'Delete',
          },
          {
            path: 'attach-volume',
            element: 'Attach a volume',
          },
        ],
      },
      {
        path: 'onboarding',
        lazy: () => import('@/pages/OnboardingPage'),
      },
      {
        path: 'new',
        lazy: () => import('@/pages/NewPage'),
      },
      {
        path: ':instanceId',
        id: 'instances.dashboard',
        lazy: () => import('@/pages/instance/DashboardPage'),
        children: [
          {
            path: 'backup',
            element: 'Create a backup',
          },
          {
            path: 'boot',
            lazy: () => import('@/pages/instance/BootPage'),
          },
          {
            path: 'stop',
            element: 'Stop',
          },
          {
            path: 'soft-reboot',
            element: 'Hot reboot',
          },
          {
            path: 'hard-reboot',
            element: 'Cold reboot',
          },
          {
            path: 'delete',
            element: 'Delete',
          },
          {
            path: 'attach-volume',
            element: 'Attach a volume',
          },
        ],
      },
      {
        path: ':instanceId/edit',
        lazy: () => import('@/pages/instance/EditPage'),
      },
    ],
  },
  {
    path: '*',
    element: <>Not found page</>,
  },
];
