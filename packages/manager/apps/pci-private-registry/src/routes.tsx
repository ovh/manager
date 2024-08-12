const lazyRouteConfig = (importFn: CallableFunction) => ({
  lazy: async () => {
    const { default: moduleDefault, ...moduleExports } = await importFn();

    return {
      Component: moduleDefault,
      ...moduleExports,
    };
  },
});

export interface RouteHandle {
  tracking?: string;
}

const ROUTE_PATHS = {
  root: '/pci/projects/:projectId/private-registry',
};

export default [
  {
    path: '/',
    ...lazyRouteConfig(() => import('@/pages/Layout')),
  },
  {
    id: '',
    path: ROUTE_PATHS.root,
    ...lazyRouteConfig(() => import('@/pages/Layout')),
    children: [
      {
        path: '',
        handle: {
          tracking: 'registries',
        },
        ...lazyRouteConfig(() => import('@/pages/list/List.page')),
        children: [],
      },
    ],
  },
  {
    path: '*',
    element: <>Not found page</>,
  },
];
