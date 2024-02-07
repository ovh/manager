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
    ...lazyRouteConfig(() => import('@/pages/Layout')),
  },
  {
    path: '/pci/projects/:projectId/ssh',
    ...lazyRouteConfig(() => import('@/pages/Layout')),
    children: [
      {
        path: '',
        ...lazyRouteConfig(() => import('@/pages/ListingPage')),
        children: [
          {
            path: 'add',
            ...lazyRouteConfig(() => import('@/pages/AddSshPage')),
          },
          {
            path: ':sshId/remove',
            ...lazyRouteConfig(() => import('@/pages/RemoveSshPage')),
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
