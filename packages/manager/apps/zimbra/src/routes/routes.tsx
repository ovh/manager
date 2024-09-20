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
              {
                path: 'diagnostic',
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/Domains/ModalDiagnosticDnsRecord'),
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
                  {
                    path: 'delete',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/dashboard/EmailAccounts/ModalDeleteAlias'
                      ),
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
          {
            path: 'mailing_lists',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/MailingLists/MailingLists'),
            ),
            children: [
              {
                path: 'add',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/MailingLists/AddAndEditMailingList'
                  ),
                ),
                handle: { isOverridePage: true },
              },
              {
                path: 'settings',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/MailingLists/AddAndEditMailingList'
                  ),
                ),
                handle: { isOverridePage: true },
              },
            ],
          },
          {
            path: 'redirections',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/Redirections/Redirections'),
            ),
            children: [
              {
                path: 'add',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/Redirections/ModalAddAndEditRedirections.page'
                  ),
                ),
                handle: { isOverridePage: true },
              },
              {
                path: 'edit',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/Redirections/ModalAddAndEditRedirections.page'
                  ),
                ),
                handle: { isOverridePage: true },
              },
              /* todo for next step {
                 path: 'delete',
                 ...lazyRouteConfig(() =>
                   import(
                     '@/pages/dashboard/Redirections/ModalDeleteRedirections.page'
                   ),
                 ),
                 handle: { isOverridePage: true },
               }, */
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
