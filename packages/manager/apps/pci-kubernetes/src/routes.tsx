import { Navigate } from 'react-router-dom';

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
        children: [],
      },
      {
        path: ':kubeId',
        handle: {
          tracking: '',
        },
        ...lazyRouteConfig(() => import('@/pages/detail/Detail.page')),
        children: [
          {
            path: '',
            element: <Navigate to="service" replace />,
          },
          {
            path: 'service',
            ...lazyRouteConfig(() =>
              import('@/pages/detail/service/Service.page'),
            ),
            children: [
              {
                path: 'name',
                ...lazyRouteConfig(() =>
                  import('@/pages/rename/RenameCluster.page'),
                ),
              },
              {
                path: 'reset-kubeconfig',
                ...lazyRouteConfig(() =>
                  import('@/pages/reset/ResetKubeConfig.page'),
                ),
              },
              {
                path: 'upgrade-policy',
                ...lazyRouteConfig(() =>
                  import('@/pages/upgrade-policy/UpgradePolicy.page'),
                ),
              },
              {
                path: 'update',
                ...lazyRouteConfig(() =>
                  import('@/pages/update/UpdateVersion.page'),
                ),
              },
            ],
          },
          {
            path: 'nodepools',
            handle: {
              tracking: 'nodepools',
            },
            ...lazyRouteConfig(() =>
              import('@/pages/detail/nodepools/NodePools.page'),
            ),
          },
          {
            path: 'restrictions',
            handle: {
              tracking: 'restrictions',
            },
            ...lazyRouteConfig(() =>
              import('@/pages/detail/restrictions/Restrictions.page'),
            ),
          },
          {
            path: 'logs',
            handle: {
              tracking: 'logs',
            },
            ...lazyRouteConfig(() => import('@/pages/detail/log/Logs.page')),
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
