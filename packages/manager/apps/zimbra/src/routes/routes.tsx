import React from 'react';
import { RouteObject, UIMatch } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
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
  ONBOARDING_WELCOME,
  ONBOARDING_CONFIGURE_ORGANIZATION,
  ORDER_ZIMBRA_EMAIL_ACCOUNT,
  ORGANIZATION,
  REDIRECTION,
  VERIFY_DOMAIN,
  ONBOARDING_CONFIGURE_DOMAIN,
  ONBOARDING_CONFIGURE_EMAIL_ACCOUNTS,
} from '@/tracking.constants';

export type RouteHandle = {
  isOverridePage?: boolean;
  tracking?: {
    pageName?: string;
    pageType?: PageType;
  };
  breadcrumb?: {
    label: string;
    icon?: ODS_ICON_NAME;
  };
};

export type RouteMatch = UIMatch<unknown, RouteHandle>;

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

export const Routes: RouteObject[] = [
  {
    path: '',
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        path: ':platformId',
        ...lazyRouteConfig(() => import('@/pages/dashboard/Dashboard.layout')),
        handle: {
          breadcrumb: {
            label: 'common:app_name',
          },
        },
        children: [
          {
            path: '',
            ...lazyRouteConfig(() =>
              import(
                '@/pages/dashboard/generalInformations/GeneralInformations.page'
              ),
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
              import('@/pages/dashboard/organizations/Organizations.page'),
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
                    '@/pages/dashboard/organizations/addEdit/AddEdit.modal'
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
                        '@/pages/dashboard/organizations/addEdit/AddEdit.modal'
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
                        '@/pages/dashboard/organizations/delete/Delete.modal'
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
              import('@/pages/dashboard/domains/Domains.page'),
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
                  import('@/pages/dashboard/domains/add/Add.page'),
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
                      import('@/pages/dashboard/domains/edit/Edit.modal'),
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
                      import('@/pages/dashboard/domains/delete/Delete.modal'),
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
                      import('@/pages/dashboard/domains/verify/Verify.page'),
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
                      import(
                        '@/pages/dashboard/domains/diagnostics/Diagnostics.page'
                      ),
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
                      import(
                        '@/pages/dashboard/domains/diagnostics/Diagnostics.page'
                      ),
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
                      import(
                        '@/pages/dashboard/domains/diagnostics/Diagnostics.page'
                      ),
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
                      import(
                        '@/pages/dashboard/domains/diagnostics/Diagnostics.page'
                      ),
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
              import('@/pages/dashboard/emailAccounts/EmailAccounts.page'),
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
                  import('@/pages/dashboard/emailAccounts/add/Add.page'),
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
                    '@/pages/dashboard/emailAccounts/settings/Settings.layout'
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
                        '@/pages/dashboard/emailAccounts/EmailAccountForm.component'
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
                        '@/pages/dashboard/emailAccounts/settings/aliases/Aliases.page'
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
                            '@/pages/dashboard/emailAccounts/settings/aliases/add/Add.modal'
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
                            '@/pages/dashboard/emailAccounts/settings/aliases/delete/Delete.modal'
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
                      import(
                        '@/pages/dashboard/redirections/Redirections.page'
                      ),
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
                                '@/pages/dashboard/redirections/addEdit/AddEdit.modal'
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
                                '@/pages/dashboard/redirections/delete/Delete.modal'
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
                            '@/pages/dashboard/redirections/addEdit/AddEdit.modal'
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
                      import('@/pages/dashboard/autoReplies/AutoReplies.page'),
                    ),
                    children: [
                      {
                        path: 'add',
                        ...lazyRouteConfig(() =>
                          import('@/pages/dashboard/autoReplies/add/Add.page'),
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
                            '@/pages/dashboard/autoReplies/delete/Delete.modal'
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
                        '@/pages/dashboard/emailAccounts/delete/Delete.modal'
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
                  import('@/pages/dashboard/emailAccounts/order/Order.page'),
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
              import('@/pages/dashboard/mailingLists/MailingLists.page'),
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
                        '@/pages/dashboard/mailingLists/addEdit/AddEdit.page'
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
                  import('@/pages/dashboard/mailingLists/addEdit/AddEdit.page'),
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
              import('@/pages/dashboard/redirections/Redirections.page'),
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
                        '@/pages/dashboard/redirections/addEdit/AddEdit.modal'
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
                        '@/pages/dashboard/redirections/delete/Delete.modal'
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
                    '@/pages/dashboard/redirections/addEdit/AddEdit.modal'
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
              import('@/pages/dashboard/autoReplies/AutoReplies.page'),
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
                        '@/pages/dashboard/autoReplies/delete/Delete.modal'
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
                  import('@/pages/dashboard/autoReplies/add/Add.page'),
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
        children: [
          {
            path: '',
            ...lazyRouteConfig(() =>
              import('@/pages/onboarding/Onboarding.page'),
            ),
            handle: {
              tracking: {
                pageName: ONBOARDING,
                pageType: PageType.onboarding,
              },
            },
          },
          {
            path: 'welcome',
            ...lazyRouteConfig(() =>
              import('@/pages/onboarding/welcome/Welcome.page'),
            ),
            handle: {
              tracking: {
                pageName: ONBOARDING_WELCOME,
                pageType: PageType.onboarding,
              },
            },
          },
          {
            path: 'configure/:platformId',
            ...lazyRouteConfig(() =>
              import('@/pages/onboarding/configure/Configure.layout'),
            ),
            children: [
              {
                path: 'organization',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/onboarding/configure/organization/Organization.page'
                  ),
                ),
                handle: {
                  tracking: {
                    pageName: ONBOARDING_CONFIGURE_ORGANIZATION,
                    pageType: PageType.onboarding,
                  },
                },
              },
              {
                path: 'domain',
                ...lazyRouteConfig(() =>
                  import('@/pages/onboarding/configure/domain/Domain.page'),
                ),
                handle: {
                  tracking: {
                    pageName: ONBOARDING_CONFIGURE_DOMAIN,
                    pageType: PageType.onboarding,
                  },
                },
              },
              {
                path: 'email_accounts',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/onboarding/configure/emailAccounts/EmailAccounts.page'
                  ),
                ),
                handle: {
                  tracking: {
                    pageName: ONBOARDING_CONFIGURE_EMAIL_ACCOUNTS,
                    pageType: PageType.onboarding,
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
] as RouteObject[];
