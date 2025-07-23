/* eslint-disable max-lines */
import React from 'react';

import { Route, UIMatch } from 'react-router-dom';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { PageType } from '@ovh-ux/manager-react-shell-client';

import NotFound from '@/pages/404';
import DashboardLayout from '@/pages/dashboard/Dashboard.layout';
import EmailAccountSettingsLayout from '@/pages/dashboard/emailAccounts/settings/Settings.layout';
import Layout from '@/pages/layout';
import OnboardingConfigureLayout from '@/pages/onboarding/configure/Configure.layout';
import {
  ADD_AUTO_REPLY,
  ADD_DOMAIN,
  ADD_EMAIL_ACCOUNT,
  ADD_MAILING_LIST,
  ADD_ORGANIZATION,
  ADD_REDIRECTION,
  AUTO_REPLY,
  CANCEL_SLOT,
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
  ONBOARDING_CONFIGURE_DOMAIN,
  ONBOARDING_CONFIGURE_EMAIL_ACCOUNTS,
  ONBOARDING_CONFIGURE_ORGANIZATION,
  ONBOARDING_WELCOME,
  ORDER_ZIMBRA_EMAIL_ACCOUNT,
  ORGANIZATION,
  REDIRECTION,
  UNDO_CANCEL_SLOT,
  UPGRADE_SLOT,
  VERIFY_DOMAIN,
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

const GeneralInformationsPage = React.lazy(
  () => import('@/pages/dashboard/generalInformations/GeneralInformations.page'),
);
const OrganizationPage = React.lazy(
  () => import('@/pages/dashboard/organizations/Organizations.page'),
);
const AddOrganizationPage = React.lazy(
  () => import('@/pages/dashboard/organizations/addEdit/AddEdit.modal'),
);
const DeleteOrganizationPage = React.lazy(
  () => import('@/pages/dashboard/organizations/delete/Delete.modal'),
);
const DomainPage = React.lazy(() => import('@/pages/dashboard/domains/Domains.page'));
const AddDomainPage = React.lazy(() => import('@/pages/dashboard/domains/add/Add.page'));
const EditDomainPage = React.lazy(() => import('@/pages/dashboard/domains/edit/Edit.modal'));
const DeleteDomainPage = React.lazy(() => import('@/pages/dashboard/domains/delete/Delete.modal'));
const VerifyPage = React.lazy(() => import('@/pages/dashboard/domains/verify/Verify.page'));
const DiagnosticsPage = React.lazy(
  () => import('@/pages/dashboard/domains/diagnostics/Diagnostics.page'),
);
const EmailAccountPage = React.lazy(
  () => import('@/pages/dashboard/emailAccounts/EmailAccounts.page'),
);
const AddEmailAccountPage = React.lazy(
  () => import('@/pages/dashboard/emailAccounts/add/Add.page'),
);
const EmailAccountSettingsPage = React.lazy(
  () => import('@/pages/dashboard/emailAccounts/EmailAccountForm.component'),
);
const CancelSlotPage = React.lazy(
  () => import('@/pages/dashboard/emailAccounts/cancel/Cancel.modal'),
);
const UndoCancelSlotPage = React.lazy(
  () => import('@/pages/dashboard/emailAccounts/undoCancel/UndoCancel.modal'),
);
const UpgradeAccountPage = React.lazy(
  () => import('@/pages/dashboard/emailAccounts/upgrade/Upgrade.page'),
);
const AliasPage = React.lazy(
  () => import('@/pages/dashboard/emailAccounts/settings/aliases/Aliases.page'),
);
const AddAliasPage = React.lazy(
  () => import('@/pages/dashboard/emailAccounts/settings/aliases/add/Add.modal'),
);
const DeleteAliasPage = React.lazy(
  () => import('@/pages/dashboard/emailAccounts/settings/aliases/delete/Delete.modal'),
);
const RedirectionPage = React.lazy(
  () => import('@/pages/dashboard/redirections/Redirections.page'),
);
const EditRedirectionPage = React.lazy(
  () => import('@/pages/dashboard/redirections/addEdit/AddEdit.modal'),
);
const DeleteRedirectionPage = React.lazy(
  () => import('@/pages/dashboard/redirections/delete/Delete.modal'),
);
const AutoReplyPage = React.lazy(() => import('@/pages/dashboard/autoReplies/AutoReplies.page'));
const AddAutoReplyPage = React.lazy(() => import('@/pages/dashboard/autoReplies/add/Add.page'));
const DeleteAutoReplyPage = React.lazy(
  () => import('@/pages/dashboard/autoReplies/delete/Delete.modal'),
);
const DeleteEmailAccountPage = React.lazy(
  () => import('@/pages/dashboard/emailAccounts/delete/Delete.modal'),
);
const OrderZimbraAccountsPage = React.lazy(
  () => import('@/pages/dashboard/emailAccounts/order/Order.page'),
);
const MailingListPage = React.lazy(
  () => import('@/pages/dashboard/mailingLists/MailingLists.page'),
);
const EditMailingListPage = React.lazy(
  () => import('@/pages/dashboard/mailingLists/addEdit/AddEdit.page'),
);
const OnboardingPage = React.lazy(() => import('@/pages/onboarding/Onboarding.page'));
const OnboardingWelcomePage = React.lazy(() => import('@/pages/onboarding/welcome/Welcome.page'));
const OnboardingOrganizationPage = React.lazy(
  () => import('@/pages/onboarding/configure/organization/Organization.page'),
);
const OnboardingDomainPage = React.lazy(
  () => import('@/pages/onboarding/configure/domain/Domain.page'),
);
const OnboardingEmailAccountsPage = React.lazy(
  () => import('@/pages/onboarding/configure/emailAccounts/EmailAccounts.page'),
);

export default (
  <Route
    path={''}
    Component={Layout}
    id={'root'}
    errorElement={<ErrorBoundary redirectionApp="zimbra" isPreloaderHide isRouteShellSync />}
  >
    <Route
      path={':platformId'}
      Component={DashboardLayout}
      handle={{
        breadcrumb: {
          label: 'common:app_name',
        },
      }}
    >
      <Route
        path={''}
        Component={GeneralInformationsPage}
        handle={{
          tracking: {
            pageName: GENERAL_INFORMATIONS,
            pageType: PageType.dashboard,
          },
          breadcrumb: {
            label: `${NAMESPACES.DASHBOARD}:general_information`,
          },
        }}
      />
      <Route
        path={'organizations'}
        Component={OrganizationPage}
        handle={{
          tracking: {
            pageName: ORGANIZATION,
            pageType: PageType.listing,
          },
          breadcrumb: {
            label: 'common:organization',
          },
        }}
      >
        <Route
          path={'add'}
          Component={AddOrganizationPage}
          handle={{
            tracking: {
              pageName: ADD_ORGANIZATION,
              pageType: PageType.popup,
            },
            breadcrumb: {
              label: 'common:add_organization',
            },
          }}
        />
        <Route
          path={':organizationId'}
          handle={{
            breadcrumb: {
              label: ':organizationId',
            },
          }}
        >
          <Route
            path={'edit'}
            Component={AddOrganizationPage}
            handle={{
              tracking: {
                pageName: EDIT_ORGANIZATION,
                pageType: PageType.popup,
              },
              breadcrumb: {
                label: 'common:edit_organization',
              },
            }}
          />
          <Route
            path={'delete'}
            Component={DeleteOrganizationPage}
            handle={{
              tracking: {
                pageName: DELETE_ORGANIZATION,
                pageType: PageType.popup,
              },
              breadcrumb: {
                label: 'common:delete_organization',
              },
            }}
          />
        </Route>
      </Route>
      <Route
        path={'domains'}
        Component={DomainPage}
        handle={{
          tracking: {
            pageName: DOMAIN,
            pageType: PageType.listing,
          },
          breadcrumb: {
            label: 'common:domain',
          },
        }}
      >
        <Route
          path={'add'}
          Component={AddDomainPage}
          handle={{
            isOverridePage: true,
            tracking: {
              pageName: ADD_DOMAIN,
              pageType: PageType.funnel,
            },
            breadcrumb: {
              label: 'common:add_domain',
            },
          }}
        />
        <Route
          path={':domainId'}
          handle={{
            breadcrumb: {
              label: ':domainId',
            },
          }}
        >
          <Route
            path={'edit'}
            Component={EditDomainPage}
            handle={{
              tracking: {
                pageName: EDIT_DOMAIN,
                pageType: PageType.funnel,
              },
              breadcrumb: {
                label: 'common:edit_domain',
              },
            }}
          />
          <Route
            path={'delete'}
            Component={DeleteDomainPage}
            handle={{
              tracking: {
                pageName: DELETE_DOMAIN,
                pageType: PageType.funnel,
              },
              breadcrumb: {
                label: 'common:delete_domain',
              },
            }}
          />
          <Route
            path={'verify'}
            Component={VerifyPage}
            handle={{
              isOverridePage: true,
              tracking: {
                pageName: VERIFY_DOMAIN,
                pageType: PageType.funnel,
              },
              breadcrumb: {
                label: 'common:verify',
              },
            }}
          />
          <Route
            path={'diagnostics/mx'}
            Component={DiagnosticsPage}
            handle={{
              isOverridePage: true,
              tracking: {
                pageName: DOMAIN_DIAGNOSTICS_MX,
                pageType: PageType.funnel,
              },
              breadcrumb: {
                label: 'common:diagnostics',
              },
            }}
          />
          <Route
            path={'diagnostics/srv'}
            Component={DiagnosticsPage}
            handle={{
              isOverridePage: true,
              tracking: {
                pageName: DOMAIN_DIAGNOSTICS_SRV,
                pageType: PageType.funnel,
              },
              breadcrumb: {
                label: 'common:diagnostics',
              },
            }}
          />
          <Route
            path={'diagnostics/spf'}
            Component={DiagnosticsPage}
            handle={{
              isOverridePage: true,
              tracking: {
                pageName: DOMAIN_DIAGNOSTICS_SPF,
                pageType: PageType.funnel,
              },
              breadcrumb: {
                label: 'common:diagnostics',
              },
            }}
          />
          <Route
            path={'diagnostics/dkim'}
            Component={DiagnosticsPage}
            handle={{
              isOverridePage: true,
              tracking: {
                pageName: DOMAIN_DIAGNOSTICS_DKIM,
                pageType: PageType.funnel,
              },
              breadcrumb: {
                label: 'common:diagnostics',
              },
            }}
          />
        </Route>
      </Route>
      <Route
        path={'email_accounts'}
        Component={EmailAccountPage}
        handle={{
          tracking: {
            pageName: EMAIL_ACCOUNT,
            pageType: PageType.listing,
          },
          breadcrumb: {
            label: 'common:email_account',
          },
        }}
      >
        <Route
          path={'add'}
          Component={AddEmailAccountPage}
          handle={{
            isOverridePage: true,
            tracking: {
              pageName: ADD_EMAIL_ACCOUNT,
              pageType: PageType.funnel,
            },
            breadcrumb: {
              label: 'common:add_email_account',
            },
          }}
        />
        <Route
          path={'slot/:slotId/cancel'}
          Component={CancelSlotPage}
          handle={{
            tracking: {
              pageName: CANCEL_SLOT,
              pageType: PageType.funnel,
            },
            breadcrumb: {
              label: 'common:cancel_slot',
            },
          }}
        />
        <Route
          path={'slot/:slotId/undo_cancel'}
          Component={UndoCancelSlotPage}
          handle={{
            tracking: {
              pageName: UNDO_CANCEL_SLOT,
              pageType: PageType.funnel,
            },
            breadcrumb: {
              label: 'common:undo_cancel_slot',
            },
          }}
        />
        <Route
          path={'slot/:slotId/upgrade'}
          Component={UpgradeAccountPage}
          handle={{
            isOverridePage: true,
            tracking: {
              pageName: UPGRADE_SLOT,
              pageType: PageType.funnel,
            },
            breadcrumb: {
              label: 'common:email_account_upgrade',
            },
          }}
        />
        <Route
          id={'email_accounts_layout'}
          path={':accountId'}
          Component={EmailAccountSettingsLayout}
          handle={{
            isOverridePage: true,
            breadcrumb: {
              label: ':accountId',
            },
          }}
        >
          <Route
            path={'settings'}
            Component={EmailAccountSettingsPage}
            handle={{
              isOverridePage: true,
              tracking: {
                pageName: EDIT_EMAIL_ACCOUNT,
                pageType: PageType.funnel,
              },
              breadcrumb: {
                label: 'common:email_account_settings',
              },
            }}
          />
          <Route
            path={'aliases'}
            Component={AliasPage}
            handle={{
              isOverridePage: true,
              tracking: {
                pageName: EMAIL_ACCOUNT_ALIAS,
                pageType: PageType.listing,
              },
              breadcrumb: {
                label: 'common:alias',
              },
            }}
          >
            <Route
              path={'add'}
              Component={AddAliasPage}
              handle={{
                tracking: {
                  pageName: EMAIL_ACCOUNT_ADD_ALIAS,
                  pageType: PageType.popup,
                },
                breadcrumb: {
                  label: 'common:add_alias',
                },
              }}
            />
            <Route
              path={':aliasId/delete'}
              Component={DeleteAliasPage}
              handle={{
                tracking: {
                  pageName: EMAIL_ACCOUNT_DELETE_ALIAS,
                  pageType: PageType.popup,
                },
                breadcrumb: {
                  label: 'common:delete_alias',
                },
              }}
            />
          </Route>
          <Route
            path={'redirections'}
            Component={RedirectionPage}
            handle={{
              isOverridePage: true,
              tracking: {
                pageName: EMAIL_ACCOUNT_REDIRECTION,
                pageType: PageType.listing,
              },
              breadcrumb: {
                label: 'common:redirection',
              },
            }}
          >
            <Route
              path={':redirectionId'}
              handle={{
                breadcrumb: {
                  label: ':redirectionId',
                },
              }}
            >
              <Route
                path={'edit'}
                Component={EditRedirectionPage}
                handle={{
                  tracking: {
                    pageName: EMAIL_ACCOUNT_EDIT_REDIRECTION,
                    pageType: PageType.popup,
                  },
                  breadcrumb: {
                    label: 'common:edit_redirection',
                  },
                }}
              />
              <Route
                path={'delete'}
                Component={DeleteRedirectionPage}
                handle={{
                  tracking: {
                    pageName: EMAIL_ACCOUNT_DELETE_REDIRECTION,
                    pageType: PageType.popup,
                  },
                  breadcrumb: {
                    label: 'common:delete_redirection',
                  },
                }}
              />
            </Route>
            <Route
              path={'add'}
              Component={EditRedirectionPage}
              handle={{
                tracking: {
                  pageName: EMAIL_ACCOUNT_ADD_REDIRECTION,
                  pageType: PageType.popup,
                },
                breadcrumb: {
                  label: 'common:add_redirection',
                },
              }}
            />
          </Route>
          <Route
            path={'auto_replies'}
            handle={{
              isOverridePage: true,
              tracking: {
                pageName: EMAIL_ACCOUNT_AUTO_REPLY,
                pageType: PageType.listing,
              },
              breadcrumb: {
                label: 'common:auto_reply',
              },
            }}
            Component={AutoReplyPage}
          >
            <Route
              path={'add'}
              Component={AddAutoReplyPage}
              handle={{
                isOverridePage: true,
                tracking: {
                  pageName: EMAIL_ACCOUNT_ADD_AUTO_REPLY,
                  pageType: PageType.funnel,
                },
                breadcrumb: {
                  label: 'common:add_auto_reply',
                },
              }}
            />
            <Route
              path={':autoReplyId/delete'}
              Component={DeleteAutoReplyPage}
              handle={{
                tracking: {
                  pageName: EMAIL_ACCOUNT_DELETE_AUTO_REPLY,
                  pageType: PageType.popup,
                },
                breadcrumb: {
                  label: 'common:delete_auto_reply',
                },
              }}
            />
          </Route>
        </Route>
        <Route
          path={':accountId'}
          handle={{
            breadcrumb: {
              label: ':accountId',
            },
          }}
        >
          <Route
            path={'delete'}
            Component={DeleteEmailAccountPage}
            handle={{
              tracking: {
                pageName: DELETE_EMAIL_ACCOUNT,
                pageType: PageType.popup,
              },
              breadcrumb: {
                label: 'common:delete_email_account',
              },
            }}
          />
        </Route>
        <Route
          path={'order'}
          Component={OrderZimbraAccountsPage}
          handle={{
            isOverridePage: true,
            tracking: {
              pageName: ORDER_ZIMBRA_EMAIL_ACCOUNT,
              pageType: PageType.funnel,
            },
            breadcrumb: {
              label: 'common:order_zimbra_accounts',
            },
          }}
        />
      </Route>
      <Route
        path={'mailing_lists'}
        Component={MailingListPage}
        handle={{
          tracking: {
            pageName: MAILING_LIST,
            pageType: PageType.listing,
          },
          breadcrumb: {
            label: 'common:mailing_list',
          },
        }}
      >
        <Route
          path={':mailingListId'}
          handle={{
            breadcrumb: {
              label: ':mailingListId',
            },
          }}
        >
          <Route
            path={'settings'}
            Component={EditMailingListPage}
            handle={{
              isOverridePage: true,
              tracking: {
                pageName: EDIT_MAILING_LIST,
                pageType: PageType.funnel,
              },
              breadcrumb: {
                label: 'common:edit_mailing_list',
              },
            }}
          />
        </Route>
        <Route
          path={'add'}
          Component={EditMailingListPage}
          handle={{
            isOverridePage: true,
            tracking: {
              pageName: ADD_MAILING_LIST,
              pageType: PageType.funnel,
            },
            breadcrumb: {
              label: 'common:add_mailing_list',
            },
          }}
        />
      </Route>
      <Route
        path={'redirections'}
        Component={RedirectionPage}
        handle={{
          tracking: {
            pageName: REDIRECTION,
            pageType: PageType.listing,
          },
          breadcrumb: {
            label: 'common:redirection',
          },
        }}
      >
        <Route
          path={':redirectionId'}
          handle={{
            breadcrumb: {
              label: ':redirectionId',
            },
          }}
        >
          <Route
            path={'edit'}
            Component={EditRedirectionPage}
            handle={{
              tracking: {
                pageName: EDIT_REDIRECTION,
                pageType: PageType.popup,
              },
              breadcrumb: {
                label: 'common:edit_redirection',
              },
            }}
          />
          <Route
            path={'delete'}
            Component={DeleteRedirectionPage}
            handle={{
              tracking: {
                pageName: DELETE_REDIRECTION,
                pageType: PageType.popup,
              },
              breadcrumb: {
                label: 'common:delete_redirection',
              },
            }}
          />
        </Route>
        <Route
          path={'add'}
          Component={EditRedirectionPage}
          handle={{
            tracking: {
              pageName: ADD_REDIRECTION,
              pageType: PageType.popup,
            },
            breadcrumb: {
              label: 'common:add_redirection',
            },
          }}
        />
      </Route>
      <Route
        path={'auto_replies'}
        Component={AutoReplyPage}
        handle={{
          tracking: {
            pageName: AUTO_REPLY,
            pageType: PageType.listing,
          },
          breadcrumb: {
            label: 'common:auto_reply',
          },
        }}
      >
        <Route
          path={':autoReplyId'}
          handle={{
            breadcrumb: {
              label: ':autoReplyId',
            },
          }}
        >
          <Route
            path={'delete'}
            Component={DeleteAutoReplyPage}
            handle={{
              tracking: {
                pageName: DELETE_AUTO_REPLY,
                pageType: PageType.popup,
              },
              breadcrumb: {
                label: 'common:delete_auto_reply',
              },
            }}
          />
        </Route>
        <Route
          path={'add'}
          Component={AddAutoReplyPage}
          handle={{
            tracking: {
              pageName: ADD_AUTO_REPLY,
              pageType: PageType.popup,
            },
            isOverridePage: true,
            breadcrumb: {
              label: 'common:add_auto_reply',
            },
          }}
        />
      </Route>
    </Route>
    <Route path={'onboarding'}>
      <Route
        path={''}
        Component={OnboardingPage}
        handle={{
          tracking: {
            pageName: ONBOARDING,
            pageType: PageType.onboarding,
          },
        }}
      />
      <Route
        path={'welcome'}
        Component={OnboardingWelcomePage}
        handle={{
          tracking: {
            pageName: ONBOARDING_WELCOME,
            pageType: PageType.onboarding,
          },
        }}
      />
      <Route path={'configure/:platformId'} Component={OnboardingConfigureLayout}>
        <Route
          path={'organization'}
          Component={OnboardingOrganizationPage}
          handle={{
            tracking: {
              pageName: ONBOARDING_CONFIGURE_ORGANIZATION,
              pageType: PageType.onboarding,
            },
          }}
        />
        <Route
          path={'domain'}
          Component={OnboardingDomainPage}
          handle={{
            tracking: {
              pageName: ONBOARDING_CONFIGURE_DOMAIN,
              pageType: PageType.onboarding,
            },
          }}
        />
        <Route
          path={'email_accounts'}
          Component={OnboardingEmailAccountsPage}
          handle={{
            tracking: {
              pageName: ONBOARDING_CONFIGURE_EMAIL_ACCOUNTS,
              pageType: PageType.onboarding,
            },
          }}
        />
      </Route>
    </Route>
    <Route path={'*'} element={<NotFound />} />
  </Route>
);
