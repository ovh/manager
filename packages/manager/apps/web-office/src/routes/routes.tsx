import React from 'react';
import { RouteObject } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import NotFound from '@/pages/404';
import { urls } from '@/routes/routes.constants';

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
    path: '',
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        path: urls.listing,
        ...lazyRouteConfig(() => import('@/pages/licenses/licenses.page')),
        handle: {
          tracking: {
            pageName: 'licenses',
            pageType: PageType.listing,
          },
        },
      },
      {
        path: urls.dashboard,
        ...lazyRouteConfig(() => import('@/pages/dashboard')),
        children: [
          {
            path: '',
            ...lazyRouteConfig(() => import('@/pages/dashboard/users/Users')),
            handle: {
              tracking: {
                pageName: 'license',
                pageType: PageType.dashboard,
              },
            },
            children: [
              {
                path: urls.users_delete,
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/users/ModalDeleteUsers.component'),
                ),
                handle: {
                  tracking: {
                    pageName: 'users-delete',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                path: urls.users_edit,
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/users/ModalEditUsers.component'),
                ),
                handle: {
                  tracking: {
                    pageName: 'users-edit',
                    pageType: PageType.popup,
                  },
                },
              },

              {
                path: urls.change_password,
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/users/ModalChangePasswordUsers.component'
                  ),
                ),
                handle: {
                  tracking: {
                    pageName: 'users-changePassword',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                path: urls.order_licenses,
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/users/ModalOrderLicenses.component'
                  ),
                ),
                handle: {
                  tracking: {
                    pageName: 'users-orderLicenses',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                path: urls.order_users,
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/users/ModalOrderUsers.component'),
                ),
                handle: {
                  tracking: {
                    pageName: 'users-orderUsers',
                    pageType: PageType.popup,
                  },
                },
              },
            ],
          },
          {
            path: 'consumption',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/consumption/Consumption'),
            ),
            handle: {
              tracking: {
                pageName: 'consumption',
                pageType: PageType.dashboard,
              },
            },
          },
        ],
      },
      {
        path: urls.onboarding,
        ...lazyRouteConfig(() => import('@/pages/onboarding')),
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
