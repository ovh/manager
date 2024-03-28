import React from 'react';
import { RouteObject } from 'react-router-dom';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import NotFound from '@/pages/404';
import { urls, pageTrackingLabels } from './constants';
import RootWrapper from '@/pages/RootWrapper';
import DashboardWrapper from '@/pages/DashboardWrapper';

export const getRoutes = ({
  trackPage,
}: ReturnType<typeof useOvhTracking>): RouteObject[] => {
  const routeConfig = ({
    pageImport,
    path,
    ...props
  }: {
    pageImport: CallableFunction;
    path: string;
  } & any) => {
    return {
      ...props,
      path,
      id: pageTrackingLabels[path],
      lazy: async () => {
        const { default: moduleDefault, ...moduleExports } = await pageImport();
        return {
          Component: moduleDefault,
          ...moduleExports,
        };
      },
    };
  };

  return [
    {
      id: 'vrack-services',
      path: urls.root,
      Component: RootWrapper,
      children: [
        routeConfig({
          pageImport: () => import('@/pages/listing'),
          path: urls.listing,
          children: [
            routeConfig({
              pageImport: () => import('@/pages/associate'),
              path: urls.associate,
            }),
          ],
        }),
        routeConfig({
          pageImport: () => import('@/pages/onboarding'),
          path: urls.onboarding,
        }),
        routeConfig({
          pageImport: () => import('@/pages/create'),
          path: urls.createVrackServices,
        }),
        {
          id: 'dashboard',
          path: urls.dashboard,
          Component: DashboardWrapper,
          children: [
            routeConfig({
              pageImport: () => import('@/pages/overview'),
              path: urls.overview,
            }),
            routeConfig({
              pageImport: () => import('@/pages/subnets'),
              path: urls.subnets,
            }),
            routeConfig({
              pageImport: () => import('@/pages/subnets/CreateSubnet'),
              path: urls.createSubnet,
            }),
            routeConfig({
              pageImport: () => import('@/pages/endpoints'),
              path: urls.endpoints,
            }),
            routeConfig({
              pageImport: () => import('@/pages/endpoints/CreateEndpoint'),
              path: urls.createEndpoint,
            }),
          ],
        },
      ],
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ];
};
