import React from 'react';

import { Route } from 'react-router-dom';

import { PageType } from '@ovh-ux/manager-react-shell-client';

import { subRoutes, urlParams } from './routes.constants';

const MainLayout = React.lazy(() => import('../pages/MainLayout.component'));

const VaultListingPage = React.lazy(() => import('../pages/vaults/listing/Listing.page'));

const TenantGeneralInformationPage = React.lazy(
  () => import('../pages/services/dashboard/general-information/GeneralInformation.page'),
);

const DeleteTenantPage = React.lazy(
  () => import('@/pages/services/dashboard/delete/DeleteTenant.page'),
);

const TenantResetPasswordPage = React.lazy(
  () => import('../pages/services/dashboard/reset-password/ResetTenantPassword.page'),
);
const AgentListingPage = React.lazy(
  () => import('../pages/services/dashboard/agent/AgentsListing.page'),
);
const AgentAddConfigurationPage = React.lazy(
  () => import('../pages/services/dashboard/agent/add-configuration/AddConfiguration.page'),
);
const AgentEditConfigurationPage = React.lazy(
  () => import('../pages/services/dashboard/agent/edit-configuration/EditConfiguration.page'),
);
const AgentDownloadLinkPage = React.lazy(
  () => import('../pages/services/dashboard/agent/download/AgentDownload.page'),
);
const VaultDeletePage = React.lazy(() => import('@/pages/vaults/delete/DeleteVault.page'));

const VaultDashboardPage = React.lazy(() => import('@/pages/vaults/dashboard/VaultDashboard.page'));

const VaultGeneralInformationPage = React.lazy(
  () => import('../pages/vaults/dashboard/general-information/GeneralInformation.page'),
);

const VaultBucketsPage = React.lazy(
  () => import('../pages/vaults/dashboard/buckets/VaultBuckets.page'),
);

const AgentDeletePage = React.lazy(
  () => import('@/pages/services/dashboard/agent/delete/DeleteAgent.page'),
);

const BillingListingPage = React.lazy(() => import('../pages/billing/listing/Listing.page'));

export default (
  <>
    <Route path="" Component={MainLayout}>
      <Route
        path={subRoutes.service}
        Component={TenantGeneralInformationPage}
        handle={{
          tracking: {
            pageName: 'general-information',
            pageType: PageType.dashboard,
          },
        }}
      >
        <Route
          path={subRoutes.resetPassword}
          Component={TenantResetPasswordPage}
          handle={{
            tracking: {
              pageName: 'reset-password',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          path={subRoutes.delete}
          Component={DeleteTenantPage}
          handle={{
            tracking: {
              pageName: 'delete-tenant',
              pageType: PageType.popup,
            },
          }}
        />
      </Route>
      <Route
        path={subRoutes.agents}
        Component={AgentListingPage}
        handle={{
          tracking: {
            pageName: 'agents',
            pageType: PageType.listing,
          },
        }}
      >
        <Route
          path={subRoutes.add}
          Component={AgentAddConfigurationPage}
          handle={{
            tracking: {
              pageName: 'add-agent-configuration',
              pageType: PageType.funnel,
            },
          }}
        />
        <Route
          path={`${subRoutes.configure}/${urlParams.agentId}`}
          Component={AgentEditConfigurationPage}
          handle={{
            tracking: {
              pageName: 'edit-agent-configuration',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          path={`${subRoutes.delete}/${urlParams.agentId}`}
          Component={AgentDeletePage}
          handle={{ tracking: { pageName: 'delete-agent', pageType: PageType.popup } }}
        />
        <Route
          path={subRoutes.download}
          Component={AgentDownloadLinkPage}
          handle={{
            tracking: {
              pageName: 'download-agent',
              pageType: PageType.popup,
            },
          }}
        />
      </Route>
      <Route path={subRoutes.vaults}>
        <Route
          path=""
          Component={VaultListingPage}
          handle={{
            tracking: {
              pageName: 'vaults',
              pageType: PageType.listing,
            },
          }}
        >
          <Route
            path={subRoutes.delete}
            Component={VaultDeletePage}
            handle={{ tracking: { pageName: 'delete-vault', pageType: PageType.popup } }}
          />
        </Route>
      </Route>
      <Route
        path={subRoutes.billing}
        Component={BillingListingPage}
        handle={{
          tracking: {
            pageName: 'billing',
            pageType: PageType.listing,
          },
        }}
      />
    </Route>

    <Route path={subRoutes.vaults}>
      <Route path={urlParams.vaultId} Component={VaultDashboardPage}>
        <Route
          path=""
          Component={VaultGeneralInformationPage}
          handle={{
            tracking: {
              pageName: 'vault-general-information',
              pageType: PageType.dashboard,
            },
          }}
        >
          <Route
            path={subRoutes.delete}
            Component={VaultDeletePage}
            handle={{ tracking: { pageName: 'delete-vault', pageType: PageType.popup } }}
          />
        </Route>
        <Route
          path={subRoutes.buckets}
          Component={VaultBucketsPage}
          handle={{
            tracking: {
              pageName: 'vault-buckets',
              pageType: PageType.listing,
            },
          }}
        />
      </Route>
    </Route>
  </>
);
