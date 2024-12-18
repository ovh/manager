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
                },
              },
              {
                path: 'diagnostic',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/Domains/ModalDiagnosticDnsRecord.component'
                  ),
                ),
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
