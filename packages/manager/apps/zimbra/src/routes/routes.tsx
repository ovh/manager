/* eslint-disable prettier/prettier */
import React from 'react';
import { RouteObject } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import NotFound from '@/pages/404';
import {
  ADD_AUTO_REPLY,
  ADD_DOMAIN,
  ADD_EMAIL_ACCOUNT,
  ADD_MAILING_LIST,
  ADD_ORGANIZATION,
  ADD_REDIRECTION,
  AUTO_REPLY,
  DELETE_AUTO_REPLY,
  DELETE_DOMAIN,
  DELETE_EMAIL_ACCOUNT,
  DELETE_ORGANIZATION,
  DELETE_REDIRECTION,
  DOMAIN,
  DOMAIN_DIAGNOSTICS_DKIM,
  DOMAIN_DIAGNOSTICS_MX,
  DOMAIN_DIAGNOSTICS_SPF,
  DOMAIN_DIAGNOSTICS_SRV,
  EDIT_DOMAIN,
  EDIT_EMAIL_ACCOUNT,
  EDIT_MAILING_LIST,
  EDIT_ORGANIZATION,
  EDIT_REDIRECTION,
  EMAIL_ACCOUNT,
  EMAIL_ACCOUNT_ADD_ALIAS,
  EMAIL_ACCOUNT_ADD_AUTO_REPLY,
  EMAIL_ACCOUNT_ADD_REDIRECTION,
  EMAIL_ACCOUNT_ALIAS,
  EMAIL_ACCOUNT_AUTO_REPLY,
  EMAIL_ACCOUNT_DELETE_ALIAS,
  EMAIL_ACCOUNT_DELETE_AUTO_REPLY,
  EMAIL_ACCOUNT_DELETE_REDIRECTION,
  EMAIL_ACCOUNT_EDIT_REDIRECTION,
  EMAIL_ACCOUNT_REDIRECTION,
  GENERAL_INFORMATIONS,
  MAILING_LIST,
  ONBOARDING,
  ORDER_ZIMBRA_EMAIL_ACCOUNT,
  ORGANIZATION,
  REDIRECTION,
  VERIFY_DOMAIN,
} from '@/tracking.constant';

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
          breadcrumbLabel: 'common:app_name',
        },
        children: [
          {
            path: '',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/GeneralInformation/GeneralInformation'),
            ),
            handle: {
              tracking: {
                pageName: GENERAL_INFORMATIONS,
                pageType: PageType.dashboard,
              },
              breadcrumbLabel: 'common:general_informations',
            },
          },
          {
            path: 'organizations',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/Organizations/Organizations'),
            ),
            handle: {
              tracking: {
                pageName: ORGANIZATION,
                pageType: PageType.listing,
              },
              breadcrumbLabel: 'common:organization',
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
                  tracking: {
                    pageName: ADD_ORGANIZATION,
                    pageType: PageType.popup,
                  },
                  breadcrumbLabel: 'common:add_organization',
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
                  tracking: {
                    pageName: EDIT_ORGANIZATION,
                    pageType: PageType.popup,
                  },
                  breadcrumbLabel: 'common:edit_organization',
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
                  tracking: {
                    pageName: DELETE_ORGANIZATION,
                    pageType: PageType.popup,
                  },
                  breadcrumbLabel: 'common:delete_organization',
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
              tracking: {
                pageName: DOMAIN,
                pageType: PageType.listing,
              },
              breadcrumbLabel: 'common:domain',
            },
            children: [
              {
                path: 'add',
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/Domains/AddDomain.page'),
                ),
                handle: {
                  isOverridePage: true,
                  tracking: {
                    pageName: ADD_DOMAIN,
                    pageType: PageType.funnel,
                  },
                  breadcrumbLabel: 'common:add_domain',
                },
              },
              {
                path: 'edit',
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/Domains/ModalEditDomain.component'),
                ),
                handle: {
                  tracking: {
                    pageName: EDIT_DOMAIN,
                    pageType: PageType.funnel,
                  },
                  breadcrumbLabel: 'common:edit_domain',
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
                  tracking: {
                    pageName: DELETE_DOMAIN,
                    pageType: PageType.funnel,
                  },
                  breadcrumbLabel: 'common:delete_domain',
                },
              },
              {
                path: 'verify',
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/Domains/VerifyDomain.page'),
                ),
                handle: {
                  isOverridePage: true,
                  tracking: {
                    pageName: VERIFY_DOMAIN,
                    pageType: PageType.funnel,
                  },
                  breadcrumbLabel: 'common:verify',
                },
              },
              {
                path: 'diagnostics/mx',
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/Domains/Diagnostics.page'),
                ),
                handle: {
                  isOverridePage: true,
                  tracking: {
                    pageName: DOMAIN_DIAGNOSTICS_MX,
                    pageType: PageType.funnel,
                  },
                  breadcrumbLabel: 'common:diagnostics',
                },
              },
              {
                path: 'diagnostics/srv',
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/Domains/Diagnostics.page'),
                ),
                handle: {
                  isOverridePage: true,
                  tracking: {
                    pageName: DOMAIN_DIAGNOSTICS_SRV,
                    pageType: PageType.funnel,
                  },
                  breadcrumbLabel: 'common:diagnostics',
                },
              },
              {
                path: 'diagnostics/spf',
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/Domains/Diagnostics.page'),
                ),
                handle: {
                  isOverridePage: true,
                  tracking: {
                    pageName: DOMAIN_DIAGNOSTICS_SPF,
                    pageType: PageType.funnel,
                  },
                  breadcrumbLabel: 'common:diagnostics',
                },
              },
              {
                path: 'diagnostics/dkim',
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/Domains/Diagnostics.page'),
                ),
                handle: {
                  isOverridePage: true,
                  tracking: {
                    pageName: DOMAIN_DIAGNOSTICS_DKIM,
                    pageType: PageType.funnel,
                  },
                  breadcrumbLabel: 'common:diagnostics',
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
              tracking: {
                pageName: EMAIL_ACCOUNT,
                pageType: PageType.listing,
              },
              breadcrumbLabel: 'common:email_account',
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
                  tracking: {
                    pageName: ADD_EMAIL_ACCOUNT,
                    pageType: PageType.funnel,
                  },
                  breadcrumbLabel: 'common:add_email_account',
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
                  tracking: {
                    pageName: EDIT_EMAIL_ACCOUNT,
                    pageType: PageType.funnel,
                  },
                  breadcrumbLabel: 'common:email_account_settings',
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
                  tracking: {
                    pageName: EMAIL_ACCOUNT_ALIAS,
                    pageType: PageType.listing,
                  },
                  breadcrumbLabel: 'common:alias',
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
                      tracking: {
                        pageName: EMAIL_ACCOUNT_ADD_ALIAS,
                        pageType: PageType.popup,
                      },
                      breadcrumbLabel: 'common:add_alias',
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
                      tracking: {
                        pageName: EMAIL_ACCOUNT_DELETE_ALIAS,
                        pageType: PageType.popup,
                      },
                      breadcrumbLabel: 'common:delete_alias',
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
                  tracking: {
                    pageName: EMAIL_ACCOUNT_REDIRECTION,
                    pageType: PageType.listing,
                  },
                  breadcrumbLabel: 'common:redirection',
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
                      tracking: {
                        pageName: EMAIL_ACCOUNT_ADD_REDIRECTION,
                        pageType: PageType.popup,
                      },
                      breadcrumbLabel: 'common:add_redirection',
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
                      tracking: {
                        pageName: EMAIL_ACCOUNT_EDIT_REDIRECTION,
                        pageType: PageType.popup,
                      },
                      breadcrumbLabel: 'common:edit_redirection',
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
                      tracking: {
                        pageName: EMAIL_ACCOUNT_DELETE_REDIRECTION,
                        pageType: PageType.popup,
                      },
                      breadcrumbLabel: 'common:delete_redirection',
                    },
                  },
                ],
              },
              {
                path: 'auto_replies',
                handle: {
                  isOverridePage: true,
                  tracking: {
                    pageName: EMAIL_ACCOUNT_AUTO_REPLY,
                    pageType: PageType.listing,
                  },
                  breadcrumbLabel: 'common:auto_reply',
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
                      tracking: {
                        pageName: EMAIL_ACCOUNT_ADD_AUTO_REPLY,
                        pageType: PageType.funnel,
                      },
                      breadcrumbLabel: 'common:add_auto_reply',
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
                      tracking: {
                        pageName: EMAIL_ACCOUNT_DELETE_AUTO_REPLY,
                        pageType: PageType.popup,
                      },
                      breadcrumbLabel: 'common:delete_auto_reply',
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
                  tracking: {
                    pageName: DELETE_EMAIL_ACCOUNT,
                    pageType: PageType.popup,
                  },
                  breadcrumbLabel: 'common:delete_email_account',
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
                  tracking: {
                    pageName: ORDER_ZIMBRA_EMAIL_ACCOUNT,
                    pageType: PageType.funnel,
                  },
                  breadcrumbLabel: 'common:order_zimbra_accounts',
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
              tracking: {
                pageName: MAILING_LIST,
                pageType: PageType.listing,
              },
              breadcrumbLabel: 'common:mailing_list',
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
                  tracking: {
                    pageName: ADD_MAILING_LIST,
                    pageType: PageType.funnel,
                  },
                  breadcrumbLabel: 'common:add_mailing_list',
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
                  tracking: {
                    pageName: EDIT_MAILING_LIST,
                    pageType: PageType.funnel,
                  },
                  breadcrumbLabel: 'common:edit_mailing_list',
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
              tracking: {
                pageName: REDIRECTION,
                pageType: PageType.listing,
              },
              breadcrumbLabel: 'common:redirection',
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
                  tracking: {
                    pageName: ADD_REDIRECTION,
                    pageType: PageType.popup,
                  },
                  breadcrumbLabel: 'common:add_redirection',
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
                  tracking: {
                    pageName: EDIT_REDIRECTION,
                    pageType: PageType.popup,
                  },
                  breadcrumbLabel: 'common:edit_redirection',
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
                  tracking: {
                    pageName: DELETE_REDIRECTION,
                    pageType: PageType.popup,
                  },
                  breadcrumbLabel: 'common:delete_redirection',
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
              tracking: {
                pageName: AUTO_REPLY,
                pageType: PageType.listing,
              },
              breadcrumbLabel: 'common:auto_reply',
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
                  tracking: {
                    pageName: DELETE_AUTO_REPLY,
                    pageType: PageType.popup,
                  },
                  breadcrumbLabel: 'common:delete_auto_reply',
                },
              },
              {
                path: 'add',
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/AutoReplies/AddAutoReply.page'),
                ),
                handle: {
                  tracking: {
                    pageName: ADD_AUTO_REPLY,
                    pageType: PageType.popup,
                  },
                  isOverridePage: true,
                  breadcrumbLabel: 'common:add_auto_reply',
                },
              },
            ],
          },
        ],
      },
      {
        path: 'onboarding',
        ...lazyRouteConfig(() => import('@/pages/onboarding')),
        handle: {
          tracking: {
            pageName: ONBOARDING,
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
