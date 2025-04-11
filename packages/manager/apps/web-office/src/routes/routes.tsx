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
            ...lazyRouteConfig(() =>
              import(
                '@/pages/dashboard/generalInformation/GeneralInformation.page'
              ),
            ),
            handle: {
              tracking: {
                pageName: 'general-information',
                pageType: PageType.dashboard,
              },
            },
            children: [
              {
                path: 'edit-name',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/generalInformation/updateDisplayName/UpdateDisplayName.modal'
                  ),
                ),
                handle: {
                  tracking: {
                    pageName: 'edit-name',
                    pageType: PageType.dashboard,
                  },
                },
              },
            ],
          },
          {
            path: urls.users,
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/users/Users.page'),
            ),
            handle: {
              tracking: {
                pageName: 'users',
                pageType: PageType.dashboard,
              },
            },
            children: [
              {
                path: urls.users_delete,
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/users/deleteUsers/DeleteUsers.modal'
                  ),
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
                  import('@/pages/dashboard/users/editUsers/EditUsers.modal'),
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
                    '@/pages/dashboard/users/changePasswordUsers/ChangePasswordUsers.modal'
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
                    '@/pages/dashboard/users/orderLicenses/OrderLicenses.modal'
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
                  import('@/pages/dashboard/users/orderUsers/OrderUsers.modal'),
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
              import('@/pages/dashboard/consumption/Consumption.page'),
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
