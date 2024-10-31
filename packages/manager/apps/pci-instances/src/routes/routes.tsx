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
export const SUB_PATHS = {
  onboarding: 'onboarding',
  new: 'new',
  instance: ':instanceId',
  delete: 'delete',
};

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
        children: [
          {
            path: SUB_PATHS.delete,
            ...lazyRouteConfig(() =>
              import('@/pages/instances/delete/DeleteInstance.page'),
            ),
          },
        ],
      },
      {
        path: SUB_PATHS.onboarding,
        ...lazyRouteConfig(() =>
          import('@/pages/instances/onboarding/Onboarding.page'),
        ),
      },
      {
        path: SUB_PATHS.new,
        ...lazyRouteConfig(() =>
          import('@/pages/instances/create/CreateInstance.page'),
        ),
      },
      {
        path: SUB_PATHS.instance,
        ...lazyRouteConfig(() =>
          import('@/pages/instances/instance/Instance.page'),
        ),
      },
    ],
  },
  {
    path: '*',
    element: <h1>Not found page</h1>,
  },
];

export default routes;
