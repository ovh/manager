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
    id: 'blocks',
    path: ROUTE_PATHS.root,
    loader: async ({ params }) =>
      queryClient.fetchQuery(getProjectQuery(params.projectId)),
    ...lazyRouteConfig(() => import('@/pages/Layout')),
    children: [
      {
        path: '',
        handle: {
          tracking: 'blocks',
        },
        ...lazyRouteConfig(() => import('@/pages/list/List.page')),
        children: [
          {
            path: 'attach',
            loader: ({ params, request }) => {
              // this redirection is added to be iso with angularJS app URLs
              const storageId = new URL(request.url).searchParams.get(
                'storageId',
              );
              return redirect(
                `/pci/projects/${params.projectId}/storages/blocks/attach/${storageId}`,
              );
            },
          },
          {
            path: 'attach/:volumeId',
            ...lazyRouteConfig(() =>
              import('@/pages/attach/AttachStorage.page'),
            ),
            handle: {
              tracking: 'attach',
            },
            children: [],
          },
          {
            path: 'detach',
            loader: ({ params, request }) => {
              // this redirection is added to be iso with angularJS app URLs
              const storageId = new URL(request.url).searchParams.get(
                'storageId',
              );
              return redirect(
                `/pci/projects/${params.projectId}/storages/blocks/detach/${storageId}`,
              );
            },
          },
          {
            path: 'detach/:volumeId',
            ...lazyRouteConfig(() =>
              import('@/pages/detach/DetachStorage.page'),
            ),
            handle: {
              tracking: 'detach',
            },
            children: [],
          },
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
      {
        path: 'onboarding',
        ...lazyRouteConfig(() => import('@/pages/onboarding/OnBoarding.page')),
        children: [],
      },
      {
        path: 'onboarding-list',
        ...lazyRouteConfig(() =>
          import('@/pages/onboarding/OnBoardingList.page'),
        ),
        children: [],
      },
    ],
  },
  {
    path: '*',
    element: <>Not found page</>,
  },
];
