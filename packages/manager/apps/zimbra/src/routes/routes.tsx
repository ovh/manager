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
        path: ':platformId',
        ...lazyRouteConfig(() =>
          import('@/components/layout-helpers/Dashboard/Dashboard'),
        ),
        handle: {
          breadcrumb: {
            label: 'common:app_name',
          },
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
              breadcrumb: {
                label: 'common:general_informations',
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
              breadcrumb: {
                label: 'common:organization',
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
                  breadcrumb: {
                    label: 'common:add_organization',
                  },
                },
              },
              {
                path: ':organizationId',
                handle: {
                  breadcrumb: {
                    label: ':organizationId',
                  },
                },
                children: [
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
                      breadcrumb: {
                        label: 'common:edit_organization',
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
                      breadcrumb: {
                        label: 'common:delete_organization',
                      },
                    },
                  },
                ],
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
              breadcrumb: {
                label: 'common:domain',
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
                  breadcrumb: {
                    label: 'common:add_domain',
                  },
                },
              },
              {
                path: ':domainId',
                handle: {
                  breadcrumb: {
                    label: ':domainId',
                  },
                },
                children: [
                  {
                    path: 'edit',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/dashboard/Domains/ModalEditDomain.component'
                      ),
                    ),
                    handle: {
                      tracking: {
                        pageName: EDIT_DOMAIN,
                        pageType: PageType.funnel,
                      },
                      breadcrumb: {
                        label: 'common:edit_domain',
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
                      breadcrumb: {
                        label: 'common:delete_domain',
                      },
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
                      breadcrumb: {
                        label: 'common:verify',
                      },
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
                      breadcrumb: {
                        label: 'common:diagnostics',
                      },
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
                      breadcrumb: {
                        label: 'common:diagnostics',
                      },
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
                      breadcrumb: {
                        label: 'common:diagnostics',
                      },
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
                      breadcrumb: {
                        label: 'common:diagnostics',
                      },
                    },
                  },
                ],
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
              breadcrumb: {
                label: 'common:email_account',
              },
            },
            children: [
              {
                path: 'add',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/EmailAccounts/AddEmailAccount.page'
                  ),
                ),
                handle: {
                  isOverridePage: true,
                  tracking: {
                    pageName: ADD_EMAIL_ACCOUNT,
                    pageType: PageType.funnel,
                  },
                  breadcrumb: {
                    label: 'common:add_email_account',
                  },
                },
              },
              {
                id: 'email_accounts_layout',
                path: ':accountId',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/EmailAccounts/EmailAccountSettings.layout'
                  ),
                ),
                handle: {
                  isOverridePage: true,
                  breadcrumb: {
                    label: ':accountId',
                  },
                },
                children: [
                  {
                    path: 'settings',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/dashboard/EmailAccounts/AddAndEditEmailAccount.form'
                      ),
                    ),
                    handle: {
                      isOverridePage: true,
                      tracking: {
                        pageName: EDIT_EMAIL_ACCOUNT,
                        pageType: PageType.funnel,
                      },
                      breadcrumb: {
                        label: 'common:email_account_settings',
                      },
                    },
                  },
                  {
                    path: 'aliases',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/dashboard/EmailAccounts/EmailAccountsAlias.page'
                      ),
                    ),
                    handle: {
                      isOverridePage: true,
                      tracking: {
                        pageName: EMAIL_ACCOUNT_ALIAS,
                        pageType: PageType.listing,
                      },
                      breadcrumb: {
                        label: 'common:alias',
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
                          breadcrumb: {
                            label: 'common:add_alias',
                          },
                        },
                      },
                      {
                        path: ':aliasId/delete',
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
                          breadcrumb: {
                            label: 'common:delete_alias',
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
                      isOverridePage: true,
                      tracking: {
                        pageName: EMAIL_ACCOUNT_REDIRECTION,
                        pageType: PageType.listing,
                      },
                      breadcrumb: {
                        label: 'common:redirection',
                      },
                    },
                    children: [
                      {
                        path: ':redirectionId',
                        handle: {
                          breadcrumb: {
                            label: ':redirectionId',
                          },
                        },
                        children: [
                          {
                            path: 'edit',
                            ...lazyRouteConfig(() =>
                              import(
                                '@/pages/dashboard/Redirections/ModalAddAndEditRedirection.page'
                              ),
                            ),
                            handle: {
                              tracking: {
                                pageName: EMAIL_ACCOUNT_EDIT_REDIRECTION,
                                pageType: PageType.popup,
                              },
                              breadcrumb: {
                                label: 'common:edit_redirection',
                              },
                            },
                          },
                          {
                            path: 'delete',
                            ...lazyRouteConfig(() =>
                              import(
                                '@/pages/dashboard/Redirections/ModalDeleteRedirection.component'
                              ),
                            ),
                            handle: {
                              tracking: {
                                pageName: EMAIL_ACCOUNT_DELETE_REDIRECTION,
                                pageType: PageType.popup,
                              },
                              breadcrumb: {
                                label: 'common:delete_redirection',
                              },
                            },
                          },
                        ],
                      },
                      {
                        path: 'add',
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/dashboard/Redirections/ModalAddAndEditRedirection.page'
                          ),
                        ),
                        handle: {
                          tracking: {
                            pageName: EMAIL_ACCOUNT_ADD_REDIRECTION,
                            pageType: PageType.popup,
                          },
                          breadcrumb: {
                            label: 'common:add_redirection',
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
                      breadcrumb: {
                        label: 'common:auto_reply',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/dashboard/AutoReplies/AutoReplies'),
                    ),
                    children: [
                      {
                        path: 'add',
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/dashboard/AutoReplies/AddAutoReply.page'
                          ),
                        ),
                        handle: {
                          isOverridePage: true,
                          tracking: {
                            pageName: EMAIL_ACCOUNT_ADD_AUTO_REPLY,
                            pageType: PageType.funnel,
                          },
                          breadcrumb: {
                            label: 'common:add_auto_reply',
                          },
                        },
                      },
                      {
                        path: ':autoReplyId/delete',
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
                          breadcrumb: {
                            label: 'common:delete_auto_reply',
                          },
                        },
                      },
                    ],
                  },
                ],
              },
              {
                path: ':accountId',
                handle: {
                  breadcrumb: {
                    label: ':accountId',
                  },
                },
                children: [
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
                      breadcrumb: {
                        label: 'common:delete_email_account',
                      },
                    },
                  },
                ],
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
                  breadcrumb: {
                    label: 'common:order_zimbra_accounts',
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
              breadcrumb: {
                label: 'common:mailing_list',
              },
            },
            children: [
              {
                path: ':mailingListId',
                handle: {
                  breadcrumb: {
                    label: ':mailingListId',
                  },
                },
                children: [
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
                      breadcrumb: {
                        label: 'common:edit_mailing_list',
                      },
                    },
                  },
                ],
              },
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
                  breadcrumb: {
                    label: 'common:add_mailing_list',
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
              breadcrumb: {
                label: 'common:redirection',
              },
            },
            children: [
              {
                path: ':redirectionId',
                handle: {
                  breadcrumb: {
                    label: ':redirectionId',
                  },
                },
                children: [
                  {
                    path: 'edit',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/dashboard/Redirections/ModalAddAndEditRedirection.page'
                      ),
                    ),
                    handle: {
                      tracking: {
                        pageName: EDIT_REDIRECTION,
                        pageType: PageType.popup,
                      },
                      breadcrumb: {
                        label: 'common:edit_redirection',
                      },
                    },
                  },
                  {
                    path: 'delete',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/dashboard/Redirections/ModalDeleteRedirection.component'
                      ),
                    ),
                    handle: {
                      tracking: {
                        pageName: DELETE_REDIRECTION,
                        pageType: PageType.popup,
                      },
                      breadcrumb: {
                        label: 'common:delete_redirection',
                      },
                    },
                  },
                ],
              },
              {
                path: 'add',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/Redirections/ModalAddAndEditRedirection.page'
                  ),
                ),
                handle: {
                  tracking: {
                    pageName: ADD_REDIRECTION,
                    pageType: PageType.popup,
                  },
                  breadcrumb: {
                    label: 'common:add_redirection',
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
              breadcrumb: {
                label: 'common:auto_reply',
              },
            },
            children: [
              {
                path: ':autoReplyId',
                handle: {
                  breadcrumb: {
                    label: ':autoReplyId',
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
                      breadcrumb: {
                        label: 'common:delete_auto_reply',
                      },
                    },
                  },
                ],
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
                  breadcrumb: {
                    label: 'common:add_auto_reply',
                  },
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
