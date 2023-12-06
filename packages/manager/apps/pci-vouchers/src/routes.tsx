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
    path: '/pci/projects/:projectId/vouchers',
    ...lazyRouteConfig(() => import('@/pages/VouchersPage')),
    children: [
      {
        path: 'add',
        ...lazyRouteConfig(() => import('@/pages/AddVoucherPage')),
      },
    ],
  },
  {
    path: '*',
    element: <>Not found page</>,
  },
];
