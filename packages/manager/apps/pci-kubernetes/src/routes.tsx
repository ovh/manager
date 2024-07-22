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
  root: '/pci/projects/:projectId/kubernetes',
  renameCluster: '/pci/projects/:projectId/kubernetes/:kubeId/service/name',
};

export default [
  {
    path: '/',
    ...lazyRouteConfig(() => import('@/pages/Layout')),
  },
  {
    id: 'kubernetes',
    path: ROUTE_PATHS.root,
    ...lazyRouteConfig(() => import('@/pages/Layout')),
    children: [
      {
        path: '',
        handle: {
          tracking: 'kubernetes',
        },
        ...lazyRouteConfig(() => import('@/pages/list/List.page')),
        children: [
          {
            path: 'service',
            ...lazyRouteConfig(() =>
              import('@/pages/rename/RenameCluster.page'),
            ),
            children: [
              {
                path: ROUTE_PATHS.renameCluster,
                ...lazyRouteConfig(() =>
                  import('@/pages/rename/RenameCluster.page'),
                ),
              },
            ],
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
