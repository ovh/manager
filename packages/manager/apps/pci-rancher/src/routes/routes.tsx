import { PageType } from '@ovh-ux/manager-react-shell-client';
import React from 'react';
import NotFound from '@/pages/notFound/NotFound.page';

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
  UpdateOffer = 'UpdateOffer',
}

export default [
  {
    path: '/pci/projects/:projectId',
    ...lazyRouteConfig(() =>
      import('@/components/layout-helpers/Layout.component'),
    ),
    children: [
      {
        path: 'rancher',
        ...lazyRouteConfig(() => import('@/pages/home/Home.page')),
        children: [
          {
            path: ':rancherId/delete',
            ...lazyRouteConfig(() =>
              import('@/pages/listing/delete/DeleteRancherModal.page'),
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
        ...lazyRouteConfig(() => import('@/pages/onboarding/Onboarding.page')),
        handle: {
          tracking: {
            pageName: Route.Onboarding,
            pageType: PageType.onboarding,
          },
        },
      },
      {
        path: 'rancher/new',
        ...lazyRouteConfig(() => import('@/pages/create/Create.page')),
        handle: {
          tracking: {
            pageName: Route.New,
            pageType: PageType.funnel,
          },
        },
      },
      {
        path: 'rancher/:rancherId',
        ...lazyRouteConfig(() => import('@/pages/dashboard/Dashboard.page')),
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
              import('@/pages/dashboard/edit-modal/EditModal.page'),
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
              import(
                '@/pages/dashboard/generate-access/GenerateAccessModal.page'
              ),
            ),
            handle: {
              tracking: {
                pageName: Route.GenerateAccess,
                pageType: PageType.popup,
              },
            },
          },
          {
            path: 'update-offer',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/update-offer/UpdateOfferModal.page'),
            ),
            handle: {
              tracking: {
                pageName: Route.UpdateOffer,
                pageType: PageType.popup,
              },
            },
          },
        ],
      },
      {
        path: 'rancher/:rancherId/update-software',
        ...lazyRouteConfig(() =>
          import('@/pages/dashboard/updateSoftware/UpdateSoftware.page'),
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
