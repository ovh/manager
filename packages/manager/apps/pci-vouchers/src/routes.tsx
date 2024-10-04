const lazyRouteConfig = (importFn: CallableFunction) => ({
  lazy: async () => {
    const { default: moduleDefault, ...moduleExports } = await importFn();

    return {
      Component: moduleDefault,
      ...moduleExports,
    };
  },
});

export default [
  {
    path: '/',
    ...lazyRouteConfig(() => import('@/pages/Layout')),
  },
  {
    path: '/pci/projects/:projectId/vouchers',
    ...lazyRouteConfig(() => import('@/pages/Layout')),
    children: [
      {
        path: '',
        ...lazyRouteConfig(() => import('@/pages/ListingPage')),
        children: [
          {
            path: 'add',
            ...lazyRouteConfig(() => import('@/pages/AddVoucherPage')),
          },
          {
            path: 'credit/buy',
            ...lazyRouteConfig(() => import('@/pages/BuyCreditPage')),
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
