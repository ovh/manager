export const lazyRouteConfig = (importFn: CallableFunction) => ({
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
    id: 'root',
    path: ROUTE_PATHS.root,
    ...lazyRouteConfig(() => import('@/pages/Layout')),
    children: [
      {
        path: '',
        handle: {
          tracking: 'registries',
        },
        ...lazyRouteConfig(() => import('@/pages/list/List.page')),
      },
      {
        path: ':registryId',
        children: [
          {
            path: 'api-url',
            handle: {
              tracking: 'api-url',
            },
            ...lazyRouteConfig(() => import('@/pages/api-url/APIUrl.page')),
          },
          {
            path: 'manage-cidr',
            handle: {
              tracking: 'CIDR',
            },
            ...lazyRouteConfig(() => import('@/pages/CIDR/ManageCIDR.page')),
          },
          {
            path: 'credentials',
            handle: {
              tracking: 'credentials',
            },
            ...lazyRouteConfig(() =>
              import('@/pages/credentials/Credentials.page'),
            ),
          },
          {
            id: 'delete',
            path: 'delete',
            ...lazyRouteConfig(() => import('@/pages/delete/Delete.page')),
          },
          {
            id: 'update',
            path: 'update',
            ...lazyRouteConfig(() => import('@/pages/update/Update.page')),
          },
        ],
      },
      {
        path: 'create',
        handle: {
          // tracking: 'registries',
        },
        ...lazyRouteConfig(() => import('@/pages/create/Create.page')),
      },
      {
        id: 'onboarding',
        path: 'onboarding',
        ...lazyRouteConfig(() => import('@/pages/onboarding/Onboarding.page')),
      },
      {
        id: 'upgrade-plan',
        path: 'upgrade-plan',
        ...lazyRouteConfig(() =>
          import('@/pages/upgrade-plan/UpgradePlan.page'),
        ),
      },
    ],
  },
  {
    path: '*',
    element: <>Not found page</>,
  },
];
