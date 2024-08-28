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
        children: [
          {
            id: 'edit-veeam',
            path: urls.editVeeamDisplayName,
            ...lazyRouteConfig(() =>
              import('@/pages/edit-name/EditVeeamBackupDisplayNameModal.page'),
            ),
            handle: {
              tracking: {
                pageName: 'edit_veeam-backup',
                pageType: PageType.popup,
              },
            },
          },
          {
            id: 'delete-veeam',
            path: urls.deleteVeeam,
            ...lazyRouteConfig(() =>
              import('@/pages/delete-veeam/DeleteVeeam.page'),
            ),
            handle: {
              tracking: {
                pageName: 'delete_veeam-backup',
                pageType: PageType.popup,
              },
            },
          },
        ],
      },
      {
        id: 'dashboard',
        path: urls.dashboard,
        ...lazyRouteConfig(() => import('@/pages/dashboard/Dashboard.page')),
        handle: {
          tracking: {
            pageName: 'dashboard',
            pageType: PageType.dashboard,
          },
        },
        children: [
          {
            id: 'edit-veeam-dashboard',
            path: urls.editVeeamDisplayNameFromDashboard,
            ...lazyRouteConfig(() =>
              import('@/pages/edit-name/EditVeeamBackupDisplayNameModal.page'),
            ),
            handle: {
              tracking: {
                pageName: 'edit_veeam-backup',
                pageType: PageType.popup,
              },
            },
          },
          {
            id: 'delete-veeam-dashboard',
            path: urls.deleteVeeamFromDashboard,
            ...lazyRouteConfig(() =>
              import('@/pages/delete-veeam/DeleteVeeam.page'),
            ),
            handle: {
              tracking: {
                pageName: 'delete_veeam-backup',
                pageType: PageType.popup,
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
