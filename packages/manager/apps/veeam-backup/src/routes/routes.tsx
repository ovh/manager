import React from 'react';
import { RouteObject } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import NotFound from '@/pages/404';
import { urls } from '@/routes/routes.constant';

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

export const routes: any[] = [
  {
    path: urls.root,
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        id: 'listing',
        path: urls.listing,
        ...lazyRouteConfig(() => import('@/pages/listing/Listing.page')),
        handle: {
          tracking: {
            pageName: 'listing',
            pageType: PageType.listing,
          },
        },
      },
      {
        path: urls.dashboard,
        ...lazyRouteConfig(() => import('@/pages/dashboard')),
        children: [
          {
            id: 'dashboard',
            path: '',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/general-informations'),
            ),
            handle: {
              tracking: {
                pageName: 'dashboard',
                pageType: PageType.dashboard,
              },
            },
          },
          {
            id: 'dashboard.tab2',
            path: 'Tab2',
            ...lazyRouteConfig(() => import('@/pages/dashboard/tab2')),
            handle: {
              tracking: {
                pageName: 'tab2',
                pageType: PageType.dashboard,
              },
            },
          },
        ],
      },
      {
        id: 'order-veeam',
        path: urls.orderVeeam,
        ...lazyRouteConfig(() => import('@/pages/order-veeam/OrderVeeam.page')),
        handle: {
          tracking: {
            pageName: 'order-veeam',
            pageType: PageType.funnel,
          },
        },
      },
      {
        id: 'onboarding',
        path: urls.onboarding,
        ...lazyRouteConfig(() => import('@/pages/onboarding/Onboarding.page')),
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
