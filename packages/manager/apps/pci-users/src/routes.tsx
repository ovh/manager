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
    path: '/pci/projects/:projectId/users',
    ...lazyRouteConfig(() => import('@/pages/Layout')),
    children: [
      {
        path: '',
        ...lazyRouteConfig(() => import('@/pages/ListingPage')),
        children: [],
      },
      {
        path: 'delete',
        ...lazyRouteConfig(() => import('@/pages/RemoveUserPage')),
        children: [],
      },
    ],
  },
  {
    path: '*',
    element: <>Not found page</>,
  },
];
