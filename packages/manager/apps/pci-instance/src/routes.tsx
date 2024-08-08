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
    path: '*',
    element: <h1>Not found page</h1>,
  },
];
