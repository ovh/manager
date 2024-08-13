import React from 'react';
import { RouteObject } from 'react-router-dom';
import NotFound from '@/pages/404';

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
        path: ':serviceName',
        ...lazyRouteConfig(() => import('@/pages/dashboard/_layout')),
        children: [
          {
            path: '',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/GeneralInformation/GeneralInformation'),
            ),
          },
          {
            path: 'organizations',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/Organizations/Organizations'),
            ),
            children: [
              {
                path: 'add',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/Organizations/ModalAddAndEditOrganization'
                  ),
                ),
              },
              {
                path: 'edit',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/Organizations/ModalAddAndEditOrganization'
                  ),
                ),
              },
              {
                path: 'delete',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/Organizations/ModalDeleteOrganization'
                  ),
                ),
              },
            ],
          },
          {
            path: 'domains',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/Domains/Domains'),
            ),
            children: [
              {
                path: 'add',
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/Domains/AddDomain'),
                ),
                handle: { isOverridePage: true },
              },
              {
                path: 'delete',
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/Domains/ModalDeleteDomain'),
                ),
              },
            ],
          },
          {
            path: 'email_accounts',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/EmailAccounts/EmailAccounts'),
            ),
            children: [
              {
                path: 'add',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/EmailAccounts/AddAndEditEmailAccount'
                  ),
                ),
                handle: { isOverridePage: true },
              },
              {
                path: 'settings',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/EmailAccounts/AddAndEditEmailAccount'
                  ),
                ),
                handle: { isOverridePage: true },
              },
              {
                path: 'alias',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/EmailAccounts/AddAndEditEmailAccount'
                  ),
                ),
                handle: { isOverridePage: true },
                children: [
                  {
                    path: 'add',
                    ...lazyRouteConfig(() =>
                      import('@/pages/dashboard/EmailAccounts/ModalAddAlias'),
                    ),
                  },
                ],
              },
              {
                path: 'delete',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/EmailAccounts/ModalDeleteEmailAccount'
                  ),
                ),
              },
            ],
          },
        ],
      },
      {
        path: 'onboarding',
        ...lazyRouteConfig(() => import('@/pages/onboarding')),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
