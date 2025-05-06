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
        id: 'allDomListing',
        path: urls.alldomsRoot,
        ...lazyRouteConfig(() =>
          import('@/alldoms/pages/service/serviceList/serviceList'),
        ),
        handle: {
          tracking: {
            pageName: 'listing',
            pageType: PageType.listing,
          },
        },
      },
      {
        id: 'allDomDetail',
        path: urls.alldomsDetail,
        ...lazyRouteConfig(() =>
          import('@/alldoms/pages/service/serviceDetail/serviceDetail'),
        ),
        handle: {
          tracking: {
            pageName: 'listing',
            pageType: PageType.listing,
          },
        },
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
