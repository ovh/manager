import React from 'react';
import { RouteObject } from 'react-router-dom';
import NotFound from '@/pages/404';
import { urls } from './constants';

const lazyRouteConfig = (importFn: CallableFunction) => {
  return {
    lazy: async () => {
      const { default: moduleDefault, ...moduleExports } = await importFn();

      return {
        Component: moduleDefault,
        ...moduleExports,
      };
    },
  };
};

export const appPrefix =
  window.location.href.includes('localhost:9001') || !import.meta.env.DEV
    ? ''
    : '/vrack-services';

export const routes: RouteObject[] = [
  {
    path: urls.root,
    ...lazyRouteConfig(() => import('@/pages/RootWrapper')),
    children: [
      {
        path: urls.listing,
        ...lazyRouteConfig(() => import('@/pages/listing')),
      },
      {
        path: urls.onboarding,
        ...lazyRouteConfig(() => import('@/pages/onboarding')),
      },
      {
        path: urls.createVrackServices,
        ...lazyRouteConfig(() => import('@/pages/create')),
      },
      {
        path: urls.dashboard,
        ...lazyRouteConfig(() => import('@/pages/DashboardWrapper')),
        children: [
          {
            path: urls.overview,
            ...lazyRouteConfig(() => import('@/pages/overview')),
          },
          {
            path: urls.subnets,
            ...lazyRouteConfig(() => import('@/pages/subnets')),
          },
          {
            path: urls.createSubnet,
            ...lazyRouteConfig(() => import('@/pages/subnets/CreateSubnet')),
          },
          {
            path: urls.endpoints,
            ...lazyRouteConfig(() => import('@/pages/endpoints')),
          },
          {
            path: urls.createEndpoint,
            ...lazyRouteConfig(() =>
              import('@/pages/endpoints/CreateEndpoint'),
            ),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
