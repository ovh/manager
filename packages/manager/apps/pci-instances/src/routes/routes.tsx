import { RouteObject } from 'react-router-dom';
import { getProjectQuery } from '@ovh-ux/manager-pci-common';
import queryClient from '@/queryClient';

const lazyRouteConfig = (importFn: CallableFunction) => ({
  lazy: async () => {
    const { default: moduleDefault, ...moduleExports } = await importFn();

    return {
      Component: moduleDefault,
      ...moduleExports,
    };
  },
});

export const ROOT_PATH = '/pci/projects/:projectId/instances';
export const REGION_PATH = 'region/:regionId';
export const INSTANCE_PATH = 'instance/:instanceId';
export const SECTIONS = {
  onboarding: 'onboarding',
  new: 'new',
  instance: ':instanceId',
  delete: 'delete',
  stop: 'stop',
  start: 'start',
  shelve: 'shelve',
  unshelve: 'unshelve',
  softReboot: 'soft-reboot',
  hardReboot: 'hard-reboot',
  reinstall: 'reinstall',
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
];

const instanceActionLegacyRoutes = instanceActionsSections.map((section) => ({
  path: section,
  ...lazyRouteConfig(() =>
    import('@/pages/instances/action/LegacyInstanceAction.page'),
  ),
}));

const instanceActionRoutes = instanceActionsSections.map((section) => ({
  path: `${REGION_PATH}/${INSTANCE_PATH}/${section}`,
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
        children: [...instanceActionLegacyRoutes, ...instanceActionRoutes],
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
        path: SECTIONS.instance,
        ...lazyRouteConfig(() =>
          import('@/pages/instances/instance/Instance.page'),
        ),
      },
    ],
  },
  {
    path: '*',
    ...lazyRouteConfig(() => import('@/pages/404/NotFound.page')),
  },
];

export default routes;
