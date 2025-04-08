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

export const Routes: any = [
  {
    path: '/',
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        id: 'listing',
        path: urls.listing,
        ...lazyRouteConfig(() => import('@/pages/listing')),
        children: [
          {
            id: 'ips',
            path: '',
            ...lazyRouteConfig(() =>
              import('@/pages/listing/ipListing/ip.listing.page'),
            ),
            handle: {
              tracking: {
                pageName: 'ips',
                pageType: PageType.listing,
              },
            },
          },
          {
            id: 'manage-organisations',
            path: urls.manageOrganisations,
            ...lazyRouteConfig(() =>
              import(
                '@/pages/listing/manageOrganisations/manage.organisations.page'
              ),
            ),
            children: [
              {
                id: 'open',
                path: urls.openOrganisationsModel,
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/listing/manageOrganisations/OpenOrganisations/OpenOrganisationsModal.page'
                  ),
                ),
                handle: {
                  tracking: {
                    pageName: 'manage-organisations-open',
                    pageType: PageType.listing,
                  },
                },
              },
            ],
            handle: {
              tracking: {
                pageName: 'manage-organisations',
                pageType: PageType.listing,
              },
            },
          },
        ],
        handle: {
          tracking: {
            pageName: 'listing',
            pageType: PageType.listing,
          },
        },
      },
      {
        id: 'onboarding',
        path: urls.onboarding,
        ...lazyRouteConfig(() => import('@/pages/onboarding')),
        handle: {
          tracking: {
            pageName: 'onboarding',
            pageType: PageType.onboarding,
          },
        },
      },
      {
        id: 'order',
        path: urls.order,
        ...lazyRouteConfig(() => import('@/pages/order/Order.page')),
        handle: {
          tracking: {
            pageName: 'order',
            pageType: PageType.funnel,
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
