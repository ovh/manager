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
    children: [
      {
        path: '',
        ...lazyRouteConfig(() => import('@/pages/Home')),
      },
    ],
  },
  {
    path: '*',
    element: <>Not found page</>,
  },
];
