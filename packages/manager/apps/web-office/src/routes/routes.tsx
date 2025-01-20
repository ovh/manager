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
                path: 'users/delete',
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
                path: 'users/edit',
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
            ],
          },
          {
            path: 'consumption',
            ...lazyRouteConfig(() => import('@/pages/dashboard/consumption')),
            handle: {
              tracking: {
                pageName: 'consumption',
                pageType: PageType.dashboard,
              },
            },
          },
        ],
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
    path: '*',
    element: <NotFound />,
  },
];
