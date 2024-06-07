import { redirect } from 'react-router-dom';
import { getProjectQuery } from '@ovhcloud/manager-components';
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

export interface RouteHandle {
  tracking?: string;
}

const ROUTE_PATHS = {
  root: '/pci/projects/:projectId/storages/blocks',
};

export default [
  {
    path: '/',
    ...lazyRouteConfig(() => import('@/pages/Layout')),
  },
  {
    id: 'pci-block-storage',
    path: ROUTE_PATHS.root,
    loader: async ({ params }) =>
      queryClient.fetchQuery(getProjectQuery(params.projectId)),
    ...lazyRouteConfig(() => import('@/pages/Layout')),
    children: [
      {
        path: '',
        ...lazyRouteConfig(() => import('@/pages/list/List.page')),
        children: [
          {
            path: 'delete',
            loader: ({ params, request }) => {
              // this redirection is added to be iso with angularJS app URLs
              const storageId = new URL(request.url).searchParams.get(
                'storageId',
              );
              return redirect(
                `/pci/projects/${params.projectId}/storages/blocks/delete/${storageId}`,
              );
            },
          },
          {
            path: 'delete/:volumeId',
            ...lazyRouteConfig(() =>
              import('@/pages/delete/DeleteStorage.page'),
            ),
            handle: {
              tracking: 'delete',
            },
            children: [],
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
