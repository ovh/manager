import { RouteObject } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import NotFound from '@/pages/404';
import { urls } from '@/routes/routes.constants';
import {
  EDIT_ACCOUNT,
  EDIT_PASSWORD,
  GENERAL_INFORMATION,
  LICENCES,
  USAGE,
  DELETE_ACCOUNT,
  ORDER_ACCOUNT,
} from '@/tracking.constants';

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
                pageName: GENERAL_INFORMATION,
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
                pageName: LICENCES,
                pageType: PageType.listing,
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
                    pageName: DELETE_ACCOUNT,
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
                    pageName: EDIT_ACCOUNT,
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
                    pageName: EDIT_PASSWORD,
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
                    pageName: ORDER_ACCOUNT,
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
                    pageName: ORDER_ACCOUNT,
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
                pageName: USAGE,
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
