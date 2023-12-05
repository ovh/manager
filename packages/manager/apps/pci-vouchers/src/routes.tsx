const lazyRouteConfig = (importFn: CallableFunction) => {
  return {
    lazy: async () => {
      const { default: moduleDefault, ...moduleExports } = await importFn();

      return {
        Component: moduleDefault,
        ...moduleExports,
      };
    },
  };
};

export default [
  {
    path: '/',
    ...lazyRouteConfig(() => import('@/pages/Home')),
  },
  {
    path: '/pci/projects/:projectId/local-zones/instances',
    ...lazyRouteConfig(() => import('@/pages/Layout')),
    children: [
      {
        path: '',
        ...lazyRouteConfig(() => import('@/pages/ListingPage')),

        children: [
          {
            path: 'boot',
            ...lazyRouteConfig(() => import('@/pages/BootPage')),
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
        ...lazyRouteConfig(() => import('@/pages/OnboardingPage')),
      },
      {
        path: 'new',
        ...lazyRouteConfig(() => import('@/pages/NewPage')),
      },
      {
        path: ':instanceId',
        handle: {
          crumb: () => 'Instance Dashboard',
        },
        children: [
          {
            path: '',
            id: 'instances.dashboard',
            ...lazyRouteConfig(() => import('@/pages/instance/DashboardPage')),
            children: [
              {
                path: 'backup',
                ...lazyRouteConfig(() => import('@/pages/BackupPage')),
              },
              {
                path: 'boot',
                ...lazyRouteConfig(() => import('@/pages/instance/BootPage')),
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
            path: 'edit',
            ...lazyRouteConfig(() => import('@/pages/instance/EditPage')),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <>Not found page</>,
  },
];
