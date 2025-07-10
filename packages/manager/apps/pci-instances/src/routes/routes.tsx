/* eslint-disable @typescript-eslint/no-unsafe-assignment,  @typescript-eslint/no-unsafe-call */
import { RouteObject } from 'react-router-dom';
import { getProjectQuery } from '@ovh-ux/manager-pci-common';
import queryClient from '@/queryClient';
import { withSuspendedMigrateRoutes } from '@/hooks/migration/useSuspendNonMigratedRoutes';
import { instanceActionLegacyLoader } from './loaders/instanceAction/instanceActionLegacy.loader';
import { instanceLegacyRedirectionLoader } from './loaders/instanceLegacy.loader';

const lazyRouteConfig = (importFn: CallableFunction) => ({
  lazy: async () => {
    const { default: moduleDefault, ...moduleExports } = await importFn();

    /* eslint-disable @typescript-eslint/no-unsafe-return */
    return {
      Component: moduleDefault,
      ...moduleExports,
    };
  },
});

function getRouteWithMigrationWrapper<R extends RouteObject>(route: R): R {
  const newRoute = {
    ...route,
  };

  if (route.Component) {
    newRoute.Component = withSuspendedMigrateRoutes(route.Component);
  }

  if (route.lazy) {
    newRoute.lazy = async () => {
      const lazyValues = await (route.lazy as NonNullable<typeof route.lazy>)();

      if (lazyValues.Component) {
        lazyValues.Component = withSuspendedMigrateRoutes(lazyValues.Component);
      }

      return lazyValues;
    };
  }

  if (route.children) {
    newRoute.children = route.children.map((subRoute) =>
      getRouteWithMigrationWrapper(subRoute),
    );
  }

  return newRoute;
}

export const ROOT_PATH = '/pci/projects/:projectId/instances';
export const REGION_PATH = 'region/:regionId';
export const INSTANCE_PATH = 'instance/:instanceId';
export const SECTIONS = {
  onboarding: 'onboarding',
  new: 'new',
  instanceLegacy: ':instanceId',
  delete: 'delete',
  stop: 'stop',
  start: 'start',
  shelve: 'shelve',
  unshelve: 'unshelve',
  softReboot: 'soft-reboot',
  hardReboot: 'hard-reboot',
  reinstall: 'reinstall',
  rescue: 'rescue/start',
  rescueEnd: 'rescue/end',
  createBackup: 'backup',
  edit: ':instanceId/edit',
  activateMonthlyBilling: 'billing/monthly/activate',
};

const instanceActionsSections = [
  SECTIONS.delete,
  SECTIONS.start,
  SECTIONS.stop,
  SECTIONS.shelve,
  SECTIONS.unshelve,
  SECTIONS.softReboot,
  SECTIONS.hardReboot,
  SECTIONS.reinstall,
  SECTIONS.rescue,
  SECTIONS.rescueEnd,
  SECTIONS.createBackup,
  SECTIONS.activateMonthlyBilling,
];

const instanceActionLegacyRoutes: RouteObject[] = instanceActionsSections.map(
  (section) => ({
    id: section,
    path: section,
    loader: instanceActionLegacyLoader,
  }),
);

const instancesActionsRoutes = instanceActionsSections.map((section) => ({
  path: `${REGION_PATH}/${INSTANCE_PATH}/${section}`,
  ...lazyRouteConfig(() =>
    import('@/pages/instances/action/InstanceAction.page'),
  ),
}));

const instanceLegacyRoutes: RouteObject[] = instanceActionsSections.map(
  (section) => ({
    path: section,
  }),
);

// TODO: add it the same way as the other actions
const instanceActionsRoutes = instanceActionsSections.map((section) => ({
  path: `action/${section}`,
  ...lazyRouteConfig(() =>
    import('@/pages/instances/action/InstanceAction.page'),
  ),
}));

const routes: RouteObject[] = [
  {
    path: '/',
    ...lazyRouteConfig(() => import('@/components/layout/Layout.component')),
  },
  {
    path: ROOT_PATH,
    id: 'root',
    loader: async ({ params }) =>
      queryClient.fetchQuery(getProjectQuery(params.projectId ?? '')),
    ...lazyRouteConfig(() => import('@/components/layout/Layout.component')),
    children: [
      {
        path: '',
        ...lazyRouteConfig(() => import('@/pages/instances/Instances.page')),
        children: [...instanceActionLegacyRoutes, ...instancesActionsRoutes],
      },
      {
        path: SECTIONS.onboarding,
        ...lazyRouteConfig(() =>
          import('@/pages/instances/onboarding/Onboarding.page'),
        ),
      },
      {
        path: SECTIONS.new,
        ...lazyRouteConfig(() =>
          import('@/pages/instances/create/CreateInstance.page'),
        ),
      },
      {
        path: SECTIONS.instanceLegacy,
        children: [...instanceLegacyRoutes],
        loader: instanceLegacyRedirectionLoader,
      },
      {
        path: 'region/:regionId/instance/:instanceId',
        ...lazyRouteConfig(() =>
          import('@/pages/instances/instance/Instance.page'),
        ),
        children: [
          {
            path: '',
            ...lazyRouteConfig(() =>
              import('@/pages/instances/instance/dashboard/Dashboard.page'),
            ),
            children: [
              ...instanceActionsRoutes,
              {
                // TODO: add it the same way as the other actions
                path: 'network/private/attach',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/instances/instance/dashboard/action/AttachNetwork.page'
                  ),
                ),
              },
            ],
          },
        ],
      },
      {
        path: SECTIONS.edit,
        ...lazyRouteConfig(() =>
          import('@/pages/instances/instance/edit/Edit.page'),
        ),
      },
      {
        path: '*',
        ...lazyRouteConfig(() => import('@/pages/404/NotFound.page')),
      },
    ].map(getRouteWithMigrationWrapper),
  },
  {
    path: '*',
    ...lazyRouteConfig(() => import('@/pages/404/NotFound.page')),
  },
];

export default routes;
