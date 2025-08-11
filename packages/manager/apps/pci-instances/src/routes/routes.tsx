import { RouteObject } from 'react-router-dom';
import { getProjectQuery } from '@ovh-ux/manager-pci-common';
import { ShellContextType } from '@ovh-ux/manager-react-shell-client';
import queryClient from '@/queryClient';
import {
  suspendNonMigratedRoutesLoader,
  withSuspendedMigrateRoutes,
} from '@/hooks/migration/useSuspendNonMigratedRoutes';
import { instanceLegacyRedirectionLoader } from './loaders/instanceLegacy.loader';

const lazyRouteConfig = (
  importFn: CallableFunction,
  componentParameters?: Record<string, unknown>,
): Pick<RouteObject, 'lazy'> => ({
  lazy: async () => {
    const { default: ComponentDefault, ...moduleExports } = await importFn();

    return {
      element: <ComponentDefault {...componentParameters} />,
      ...moduleExports,
    };
  },
});

const getRouteWithMigrationWrapper = (shell: ShellContextType) => <
  R extends RouteObject
>(
  route: R,
): R => {
  const newRoute = {
    ...route,
  };

  if (route.Component) {
    newRoute.Component = withSuspendedMigrateRoutes(route.Component);
  }
  if (route.element) {
    const routeElement = route.element;
    newRoute.Component = withSuspendedMigrateRoutes(() => routeElement);
    delete newRoute.element;
  }

  newRoute.loader = suspendNonMigratedRoutesLoader(shell, newRoute.loader);

  const parentLazy = route.lazy;
  if (parentLazy) {
    newRoute.lazy = async () => {
      const lazyValues = await parentLazy();

      if (lazyValues.loader) {
        lazyValues.loader = suspendNonMigratedRoutesLoader(
          shell,
          lazyValues.loader,
        );
      }

      if (lazyValues.Component) {
        lazyValues.Component = withSuspendedMigrateRoutes(lazyValues.Component);
      }
      if (lazyValues.element) {
        const lazyElement = lazyValues.element;
        lazyValues.Component = withSuspendedMigrateRoutes(() => lazyElement);
        delete lazyValues.element;
      }

      if (
        !route.Component &&
        !route.element &&
        !lazyValues.Component &&
        !lazyValues.element
      ) {
        lazyValues.Component = withSuspendedMigrateRoutes();
      }

      return lazyValues;
    };
  } else if (!route.Component && !route.element) {
    newRoute.Component = withSuspendedMigrateRoutes();
  }

  if (route.children) {
    newRoute.children = route.children.map((subRoute) =>
      getRouteWithMigrationWrapper(shell)(subRoute),
    );
  }

  return newRoute;
};

export const ROOT_PATH = '/pci/projects/:projectId/instances';
export const REGION_PATH = 'region/:region';
export const INSTANCE_PATH = 'instance/:instanceId';

const ACTIONS_SECTIONS = {
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
  activateMonthlyBilling: 'billing/monthly/activate',
};

export const SECTIONS = {
  ...ACTIONS_SECTIONS,
  onboarding: 'onboarding',
  new: 'new',
  instanceLegacy: ':instanceId',
  instance: `${REGION_PATH}/${INSTANCE_PATH}`,
  edit: ':instanceId/edit',
};

const getActionComponentBySection = (section: string) => {
  switch (section) {
    case SECTIONS.createBackup:
      return import('@/pages/instances/action/BackupAction.page');
    case SECTIONS.activateMonthlyBilling:
      return import('@/pages/instances/action/BillingMonthlyAction.page');
    case SECTIONS.rescue:
    case SECTIONS.rescueEnd:
      return import('@/pages/instances/action/RescueAction.page');
    case SECTIONS.reinstall:
      return import('@/pages/instances/action/ReinstallAction.page');
    default:
      return import('@/pages/instances/action/BaseAction.page');
  }
};

const instanceActionsRoutes: RouteObject[] = Object.values(
  ACTIONS_SECTIONS,
).map<RouteObject>((section) => ({
  path: section,
  ...lazyRouteConfig(() => getActionComponentBySection(section), { section }),
  loader: instanceLegacyRedirectionLoader,
}));

export const getRoutes = (shell: ShellContextType): RouteObject[] => [
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
        children: instanceActionsRoutes,
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
        children: [
          {
            path: '*',
            loader: instanceLegacyRedirectionLoader,
          },
        ],
        loader: instanceLegacyRedirectionLoader,
        ...lazyRouteConfig(() => import('@/pages/404/NotFound.page')),
      },
      {
        path: SECTIONS.instance,
        ...lazyRouteConfig(() =>
          import('@/pages/instances/instance/Instance.page'),
        ),
        children: [
          {
            path: '',
            ...lazyRouteConfig(() =>
              import('@/pages/instances/instance/dashboard/Dashboard.page'),
            ),
            children: instanceActionsRoutes,
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
    ].map(getRouteWithMigrationWrapper(shell)),
  },
  {
    path: '*',
    ...lazyRouteConfig(() => import('@/pages/404/NotFound.page')),
  },
];
