import React from 'react';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import NotFound from '@/pages/404';
import { urls } from '@/routes/routes.constant';

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

export const Routes = [
  {
    path: '/pci/projects/:projectId/savings-plan',
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        id: 'listing',
        path: '',
        ...lazyRouteConfig(() => import('@/pages/listing')),
        handle: {
          tracking: {
            pageName: 'listing',
            pageType: PageType.listing,
          },
        },
        children: [
          {
            path: ':rancherId/renew',
            ...lazyRouteConfig(() => import('@/pages/listing/renew-modal')),
            handle: {
              tracking: {
                pageName: 'renew',
                pageType: PageType.popup,
              },
            },
          },
        ],
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
        ],
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
        path: 'new',
        ...lazyRouteConfig(() => import('@/pages/create')),
        handle: {
          tracking: {
            pageName: 'create',
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
