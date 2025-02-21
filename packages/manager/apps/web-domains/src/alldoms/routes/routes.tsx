import React from 'react';
import { RouteObject } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import NotFound from '@/alldoms/pages/404';
import { urls } from '@/alldoms/routes/routes.constant';

const lazyRouteConfig = (importFn: CallableFunction): Partial<RouteObject> => {
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

export const Routes: any = [
  {
    path: urls.alldomsRoot,
    ...lazyRouteConfig(() => import('@/alldoms/pages/layout')),
    children: [
      {
        id: 'listing',
        path: urls.alldomsListing,
        ...lazyRouteConfig(() => import('@/alldoms/pages/listing')),
        handle: {
          tracking: {
            pageName: 'listing',
            pageType: PageType.listing,
          },
        },
      },
      {
        path: urls.alldomsDashboard,
        ...lazyRouteConfig(() => import('@/alldoms/pages/dashboard')),
        children: [
          {
            id: 'dashboard',
            path: '',
            ...lazyRouteConfig(
              () => import('@/alldoms/pages/dashboard/general-informations')),
            handle: {
              tracking: {
                pageName: 'dashboard',
                pageType: PageType.dashboard,
              },
            },
          }
        ],
      },
      {
        id: 'onboarding',
        path: urls.alldomsOnboarding,
        ...lazyRouteConfig(() => import('@/alldoms/pages/onboarding')),
        handle: {
          tracking: {
            pageName: 'onboarding',
            pageType: PageType.onboarding,
          },
        },
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
