import React from 'react';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import NotFound from '@/pages/404';
import { urls } from '@/routes/routes.constant';
import { Error } from '../Error';

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
    errorElement: <Error />,
    children: [
      {
        id: 'dashboard',
        path: '',
        ...lazyRouteConfig(() => import('@/pages/dashboard')),
        handle: {
          tracking: {
            pageName: 'dashboard',
          },
        },
      },
      {
        id: 'listing',
        path: 'listing',
        ...lazyRouteConfig(() => import('@/pages/listing')),
        handle: {
          tracking: {
            pageName: 'listing',
          },
        },
        children: [
          {
            path: ':savingsPlanId/renew',
            ...lazyRouteConfig(() => import('@/pages/listing/renew-modal')),
            handle: {
              tracking: {
                pageName: 'renew',
                pageType: PageType.popup,
              },
            },
          },
          {
            path: ':savingsPlanId/edit-name',
            ...lazyRouteConfig(() => import('@/pages/listing/edit-name')),
            handle: {
              tracking: {
                pageName: 'edit-name',
                pageType: PageType.popup,
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
            pageName: 'add_savings_plan',
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
