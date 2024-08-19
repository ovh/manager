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
    path: urls.root,
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        id: 'listing',
        path: urls.listing,
        ...lazyRouteConfig(() =>
          import('@/pages/listing/organizations/Organizations.page'),
        ),
        handle: {
          tracking: {
            pageName: 'listing',
            pageType: PageType.listing,
          },
        },
      },
      {
        path: urls.dashboard,
        ...lazyRouteConfig(() =>
          import('@/pages/dashboard/organization/OrganizationDashboard.page'),
        ),
        children: [
          {
            id: 'dashboard',
            path: '',
            ...lazyRouteConfig(() =>
              import(
                '@/pages/dashboard/organization/general-information/OrganizationGeneralInformation.page'
              ),
            ),
            handle: {
              tracking: {
                pageName: 'dashboard',
                pageType: PageType.dashboard,
              },
            },
            children: [
              {
                id: 'edit-name',
                path: urls.editName,
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/organization/general-information/edit/EditName.page'
                  ),
                ),
                handle: {
                  tracking: {
                    pageName: 'edit-name',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                id: 'edit-desc',
                path: urls.editDesc,
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/organization/general-information/edit/EditDescription.page'
                  ),
                ),
                handle: {
                  tracking: {
                    pageName: 'edit-desc',
                    pageType: PageType.popup,
                  },
                },
              },
            ],
          },
          {
            id: 'datacentres',
            path: urls.datacentres,
            ...lazyRouteConfig(() =>
              import('@/pages/listing/datacentres/datacentres.page'),
            ),
            handle: {
              tracking: {
                pageName: 'datacentres',
                pageType: PageType.listing,
              },
            },
          },
        ],
      },
      {
        path: urls.datacentreDashboard,
        ...lazyRouteConfig(() =>
          import('@/pages/dashboard/datacentre/DatacentreDashboard.page'),
        ),
        handle: {
          tracking: {
            pageName: 'datacentre',
            pageType: PageType.dashboard,
          },
        },
        children: [
          {
            id: 'vDcDashboard',
            path: '',
            ...lazyRouteConfig(() =>
              import(
                '@/pages/dashboard/datacentre/general-informations/DatacentreGeneralInformation.page'
              ),
            ),
            handle: {
              tracking: {
                pageName: 'dashboard',
                pageType: PageType.dashboard,
              },
            },
          },
          {
            id: 'vDcStorage',
            path: urls.datacentreStorage,
            ...lazyRouteConfig(() =>
              import(
                '@/pages/dashboard/datacentre/storage/DatacentreStorage.page'
              ),
            ),
            handle: {
              tracking: {
                pageName: 'dashboard',
                pageType: PageType.listing,
              },
            },
          },
          {
            id: 'vDcCompute',
            path: urls.datacentreCompute,
            ...lazyRouteConfig(() =>
              import(
                '@/pages/dashboard/datacentre/compute/DatacentreCompute.page'
              ),
            ),
            handle: {
              tracking: {
                pageName: 'dashboard',
                pageType: PageType.listing,
              },
            },
          },
        ],
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
