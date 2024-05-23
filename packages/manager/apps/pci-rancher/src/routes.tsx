import { PageType } from '@ovh-ux/manager-react-shell-client';
import React from 'react';
import NotFound from './pages/404';

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

export const COMMON_PATH = '/pci/projects';

export enum Route {
  Listing = 'listing',
  Dashboard = 'dashboard',
  Onboarding = 'onboarding',
  New = 'New',
  DeleteRancher = 'DeleteRancher',
  EditRancherName = 'EditRancherName',
  GenerateAccess = 'GenerateAccess',
}

export default [
  {
    path: '/pci/projects/:projectId',
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        path: 'rancher',
        ...lazyRouteConfig(() => import('@/pages/')),
        children: [
          {
            path: ':rancherId/delete',
            ...lazyRouteConfig(() =>
              import('@/pages/listing/delete/DeleteRancherModal'),
            ),
            handle: {
              tracking: {
                pageName: Route.DeleteRancher,
                pageType: PageType.popup,
              },
            },
          },
        ],
        handle: {
          tracking: {
            pageName: Route.Listing,
            pageType: PageType.listing,
          },
        },
      },
      {
        path: 'rancher/onboarding',
        ...lazyRouteConfig(() => import('@/pages/onboarding')),
        handle: {
          tracking: {
            pageName: Route.Onboarding,
            pageType: PageType.onboarding,
          },
        },
      },
      {
        path: 'rancher/new',
        ...lazyRouteConfig(() => import('@/pages/create')),
        handle: {
          tracking: {
            pageName: Route.New,
            pageType: PageType.funnel,
          },
        },
      },
      {
        path: 'rancher/:rancherId',
        ...lazyRouteConfig(() => import('@/pages/dashboard')),
        handle: {
          tracking: {
            pageName: Route.Dashboard,
            pageType: PageType.dashboard,
          },
        },
        children: [
          {
            path: 'edit',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/edit-modal/EditModal'),
            ),
            handle: {
              tracking: {
                pageName: Route.EditRancherName,
                pageType: PageType.popup,
              },
            },
          },
          {
            path: 'generate-access',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/generate-access/GenerateAccessModal'),
            ),
            handle: {
              tracking: {
                pageName: Route.GenerateAccess,
                pageType: PageType.popup,
              },
            },
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
