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
                    '@/pages/dashboard/Organizations/ModalAddAndEditOrganization.page'
                  ),
                ),
              },
              {
                path: 'edit',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/Organizations/ModalAddAndEditOrganization.page'
                  ),
                ),
              },
              {
                path: 'delete',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/Organizations/ModalDeleteOrganization.component'
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
                  import('@/pages/dashboard/Domains/AddDomain.page'),
                ),
                handle: { isOverridePage: true },
              },
              {
                path: 'edit',
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/Domains/ModalEditDomain.component'),
                ),
              },
              {
                path: 'delete',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/Domains/ModalDeleteDomain.component'
                  ),
                ),
              },
              {
                path: 'diagnostic',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/Domains/ModalDiagnosticDnsRecord.component'
                  ),
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
                    '@/pages/dashboard/EmailAccounts/AddAndEditEmailAccount.page'
                  ),
                ),
                handle: { isOverridePage: true },
              },
              {
                path: 'settings',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/EmailAccounts/AddAndEditEmailAccount.page'
                  ),
                ),
                handle: { isOverridePage: true },
              },
              {
                path: 'alias',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/EmailAccounts/AddAndEditEmailAccount.page'
                  ),
                ),
                handle: { isOverridePage: true },
                children: [
                  {
                    path: 'add',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/dashboard/EmailAccounts/ModalAddAlias.component'
                      ),
                    ),
                  },
                  {
                    path: 'delete',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/dashboard/EmailAccounts/ModalDeleteAlias.component'
                      ),
                    ),
                  },
                ],
              },
              {
                path: 'redirections',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/EmailAccounts/AddAndEditEmailAccount.page'
                  ),
                ),
                handle: { isOverridePage: true },
                children: [
                  {
                    path: 'add',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/dashboard/Redirections/ModalAddAndEditRedirections.page'
                      ),
                    ),
                  },
                  {
                    path: 'edit',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/dashboard/Redirections/ModalAddAndEditRedirections.page'
                      ),
                    ),
                  },
                  {
                    path: 'delete',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/dashboard/Redirections/ModalDeleteRedirections.component'
                      ),
                    ),
                  },
                ],
              },
              {
                path: 'delete',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/EmailAccounts/ModalDeleteEmailAccount.component'
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
                    '@/pages/dashboard/MailingLists/AddAndEditMailingList.page'
                  ),
                ),
                handle: { isOverridePage: true },
              },
              {
                path: 'settings',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/MailingLists/AddAndEditMailingList.page'
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
              {
                path: 'delete',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/Redirections/ModalDeleteRedirections.component'
                  ),
                ),
                handle: { isOverridePage: true },
              },
            ],
          },
          {
            path: 'auto_replies',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/AutoReplies/AutoReplies'),
            ),
            children: [
              {
                path: 'delete',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/AutoReplies/ModalDeleteAutoReply.component'
                  ),
                ),
                handle: { isOverridePage: true },
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
