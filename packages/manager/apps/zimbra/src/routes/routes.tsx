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
        handle: {
          breadcrumbLabel: 'zimbra_dashboard_title',
        },
        children: [
          {
            path: '',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/GeneralInformation/GeneralInformation'),
            ),
            handle: {
              breadcrumbLabel: 'zimbra_dashboard_general_informations',
            },
          },
          {
            path: 'organizations',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/Organizations/Organizations'),
            ),
            handle: {
              breadcrumbLabel: 'zimbra_dashboard_organizations',
            },
            children: [
              {
                path: 'add',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/Organizations/ModalAddAndEditOrganization.page'
                  ),
                ),
                handle: {
                  breadcrumbLabel: 'zimbra_dashboard_organizations_add',
                },
              },
              {
                path: 'edit',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/Organizations/ModalAddAndEditOrganization.page'
                  ),
                ),
                handle: {
                  breadcrumbLabel: 'zimbra_dashboard_organizations_edit',
                },
              },
              {
                path: 'delete',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/Organizations/ModalDeleteOrganization.component'
                  ),
                ),
                handle: {
                  breadcrumbLabel: 'zimbra_dashboard_organizations_delete',
                },
              },
            ],
          },
          {
            path: 'domains',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/Domains/Domains'),
            ),
            handle: {
              breadcrumbLabel: 'zimbra_dashboard_domains',
            },
            children: [
              {
                path: 'add',
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/Domains/AddDomain.page'),
                ),
                handle: {
                  isOverridePage: true,
                  breadcrumbLabel: 'zimbra_dashboard_domains_add',
                },
              },
              {
                path: 'edit',
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/Domains/ModalEditDomain.component'),
                ),
                handle: {
                  breadcrumbLabel: 'zimbra_dashboard_domains_edit',
                },
              },
              {
                path: 'delete',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/Domains/ModalDeleteDomain.component'
                  ),
                ),
                handle: {
                  breadcrumbLabel: 'zimbra_dashboard_domains_delete',
                },
              },
              {
                path: 'verify',
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/Domains/VerifyDomain.page'),
                ),
                handle: {
                  isOverridePage: true,
                  breadcrumbLabel: 'zimbra_dashboard_domains_verify',
                },
              },
              {
                path: 'diagnostics/mx',
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/Domains/Diagnostics.page'),
                ),
                handle: {
                  isOverridePage: true,
                  breadcrumbLabel: 'zimbra_dashboard_domains_diagnostics',
                },
              },
              {
                path: 'diagnostics/srv',
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/Domains/Diagnostics.page'),
                ),
                handle: {
                  isOverridePage: true,
                  breadcrumbLabel: 'zimbra_dashboard_domains_diagnostics',
                },
              },
              {
                path: 'diagnostics/spf',
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/Domains/Diagnostics.page'),
                ),
                handle: {
                  isOverridePage: true,
                  breadcrumbLabel: 'zimbra_dashboard_domains_diagnostics',
                },
              },
              {
                path: 'diagnostics/dkim',
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/Domains/Diagnostics.page'),
                ),
                handle: {
                  isOverridePage: true,
                  breadcrumbLabel: 'zimbra_dashboard_domains_diagnostics',
                },
              },
            ],
          },
          {
            path: 'email_accounts',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/EmailAccounts/EmailAccounts'),
            ),
            handle: {
              breadcrumbLabel: 'zimbra_dashboard_email_accounts',
            },
            children: [
              {
                path: 'add',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/EmailAccounts/AddAndEditEmailAccount.page'
                  ),
                ),
                handle: {
                  isOverridePage: true,
                  breadcrumbLabel: 'zimbra_dashboard_email_accounts_add',
                },
              },
              {
                path: 'settings',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/EmailAccounts/AddAndEditEmailAccount.page'
                  ),
                ),
                handle: {
                  isOverridePage: true,
                  breadcrumbLabel: 'zimbra_dashboard_email_accounts_settings',
                },
              },
              {
                path: 'alias',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/EmailAccounts/AddAndEditEmailAccount.page'
                  ),
                ),
                handle: {
                  isOverridePage: true,
                  breadcrumbLabel: 'zimbra_dashboard_email_accounts_alias',
                },
                children: [
                  {
                    path: 'add',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/dashboard/EmailAccounts/ModalAddAlias.component'
                      ),
                    ),
                    handle: {
                      breadcrumbLabel:
                        'zimbra_dashboard_email_accounts_alias_add',
                    },
                  },
                  {
                    path: 'delete',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/dashboard/EmailAccounts/ModalDeleteAlias.component'
                      ),
                    ),
                    handle: {
                      breadcrumbLabel:
                        'zimbra_dashboard_email_accounts_alias_delete',
                    },
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
                handle: {
                  isOverridePage: true,
                  breadcrumbLabel:
                    'zimbra_dashboard_email_accounts_redirections',
                },
                children: [
                  {
                    path: 'add',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/dashboard/Redirections/ModalAddAndEditRedirections.page'
                      ),
                    ),
                    handle: {
                      breadcrumbLabel:
                        'zimbra_dashboard_email_accounts_redirections_add',
                    },
                  },
                  {
                    path: 'edit',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/dashboard/Redirections/ModalAddAndEditRedirections.page'
                      ),
                    ),
                    handle: {
                      breadcrumbLabel:
                        'zimbra_dashboard_email_accounts_redirections_edit',
                    },
                  },
                  {
                    path: 'delete',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/dashboard/Redirections/ModalDeleteRedirections.component'
                      ),
                    ),
                    handle: {
                      breadcrumbLabel:
                        'zimbra_dashboard_email_accounts_redirections_delete',
                    },
                  },
                ],
              },
              {
                path: 'auto_replies',
                handle: {
                  isOverridePage: true,
                  breadcrumbLabel:
                    'zimbra_dashboard_email_accounts_auto_replies',
                },
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/EmailAccounts/AddAndEditEmailAccount.page'
                  ),
                ),
                children: [
                  {
                    path: 'add',
                    ...lazyRouteConfig(() =>
                      import('@/pages/dashboard/AutoReplies/AddAutoReply.page'),
                    ),
                    handle: {
                      isOverridePage: true,
                      breadcrumbLabel:
                        'zimbra_dashboard_email_accounts_auto_replies_add',
                    },
                  },
                  {
                    path: 'delete',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/dashboard/AutoReplies/ModalDeleteAutoReply.component'
                      ),
                    ),
                    handle: {
                      breadcrumbLabel:
                        'zimbra_dashboard_email_accounts_auto_replies_delete',
                    },
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
                handle: {
                  breadcrumbLabel: 'zimbra_dashboard_email_accounts_delete',
                },
              },
              {
                path: 'order',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/EmailAccounts/EmailAccountsOrder.page'
                  ),
                ),
                handle: {
                  isOverridePage: true,
                  breadcrumbLabel: 'zimbra_dashboard_email_accounts_order',
                },
              },
            ],
          },
          {
            path: 'mailing_lists',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/MailingLists/MailingLists'),
            ),
            handle: {
              breadcrumbLabel: 'zimbra_dashboard_mailing_lists',
            },
            children: [
              {
                path: 'add',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/MailingLists/AddAndEditMailingList.page'
                  ),
                ),
                handle: {
                  isOverridePage: true,
                  breadcrumbLabel: 'zimbra_dashboard_mailing_lists_add',
                },
              },
              {
                path: 'settings',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/MailingLists/AddAndEditMailingList.page'
                  ),
                ),
                handle: {
                  isOverridePage: true,
                  breadcrumbLabel: 'zimbra_dashboard_mailing_lists_settings',
                },
              },
            ],
          },
          {
            path: 'redirections',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/Redirections/Redirections'),
            ),
            handle: {
              breadcrumbLabel: 'zimbra_dashboard_redirections',
            },
            children: [
              {
                path: 'add',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/Redirections/ModalAddAndEditRedirections.page'
                  ),
                ),
                handle: {
                  breadcrumbLabel: 'zimbra_dashboard_redirections_add',
                },
              },
              {
                path: 'edit',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/Redirections/ModalAddAndEditRedirections.page'
                  ),
                ),
                handle: {
                  breadcrumbLabel: 'zimbra_dashboard_redirections_edit',
                },
              },
              {
                path: 'delete',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/Redirections/ModalDeleteRedirections.component'
                  ),
                ),
                handle: {
                  breadcrumbLabel: 'zimbra_dashboard_redirections_delete',
                },
              },
            ],
          },
          {
            path: 'auto_replies',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/AutoReplies/AutoReplies'),
            ),
            handle: {
              breadcrumbLabel: 'zimbra_dashboard_auto_replies',
            },
            children: [
              {
                path: 'delete',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/AutoReplies/ModalDeleteAutoReply.component'
                  ),
                ),
                handle: {
                  breadcrumbLabel: 'zimbra_dashboard_auto_replies_delete',
                },
              },
              {
                path: 'add',
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/AutoReplies/AddAutoReply.page'),
                ),
                handle: {
                  isOverridePage: true,
                  breadcrumbLabel: 'zimbra_dashboard_auto_replies_add',
                },
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
