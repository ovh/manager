import React from 'react';

import { Route } from 'react-router-dom';

import { PageType } from '@ovh-ux/manager-react-shell-client';

import { subRoutes, urlParams, vaultCredentialsRoutePath } from './routes.constants';

const OnboardingGuardPage = React.lazy(() => import('@/pages/onboarding/OnboardingGuard.page'));
const OrderPage = React.lazy(() => import('@/pages/order/Order.page'));
const AddServerPage = React.lazy(() => import('@/pages/add-server/AddServer.page'));
const ServiceLayoutPage = React.lazy(() => import('@/pages/service/ServiceLayout.page'));
const LinkedServersPage = React.lazy(() => import('@/pages/linked-servers/LinkedServers.page'));
const GeneralInformationPage = React.lazy(
  () => import('@/pages/general-information/GeneralInformation.page'),
);
const TerminateServicePage = React.lazy(
  () => import('@/pages/general-information/terminate/TerminateService.page'),
);
const EditBackupServerPage = React.lazy(
  () => import('@/pages/linked-servers/edit/EditBackupServer.page'),
);
const DeleteBackupServerPage = React.lazy(
  () => import('@/pages/linked-servers/delete/DeleteBackupServer.page'),
);
const BillingPage = React.lazy(() => import('@/pages/billing/Billing.page'));
const VaultsPage = React.lazy(() => import('@/pages/vaults/Vaults.page'));
const VaultCredentialsPage = React.lazy(
  () => import('@/pages/vaults/credentials/VaultCredentials.page'),
);

export default (
  <>
    <Route
      path={subRoutes.onboarding}
      Component={OnboardingGuardPage}
      handle={{
        tracking: { pageName: 'onboarding', pageType: PageType.onboarding },
      }}
    />
    <Route
      path={subRoutes.order}
      Component={OrderPage}
      handle={{
        tracking: { pageName: 'order', pageType: PageType.funnel },
      }}
    />
    {/* Page pleine, sœur de `order` (BKP-1218) : reprend le tunnel de commande (stepper
        vertical + récap), pas une modale. */}
    <Route
      path={`${subRoutes.edit}/${urlParams.backupServerId}`}
      Component={EditBackupServerPage}
      handle={{
        tracking: { pageName: 'edit-backup-server', pageType: PageType.funnel },
      }}
    />
    {/* Ajout d'un serveur supplémentaire (BKP-1217) : vault déjà provisionné, tunnel réduit
        à la licence + au serveur VBR — cf. AddServer.page. */}
    <Route
      path={subRoutes.addServer}
      Component={AddServerPage}
      handle={{
        tracking: { pageName: 'add-server', pageType: PageType.funnel },
      }}
    />
    {/* Route de layout sans path : la barre d'onglets n'est montée qu'une fois, et les
        onglets 1.2/1.3/1.4 n'auront qu'à s'ajouter en enfants. */}
    <Route element={<ServiceLayoutPage />}>
      <Route
        path={subRoutes.linkedServers}
        Component={LinkedServersPage}
        handle={{
          tracking: { pageName: 'linked-servers', pageType: PageType.listing },
        }}
      >
        {/* Modale enfant : elle se superpose à la liste, qui reste montée derrière. */}
        <Route
          path={`${subRoutes.delete}/${urlParams.backupServerId}`}
          Component={DeleteBackupServerPage}
          handle={{
            tracking: { pageName: 'delete-backup-server', pageType: PageType.popup },
          }}
        />
      </Route>
      <Route
        path={subRoutes.billing}
        Component={BillingPage}
        handle={{
          tracking: { pageName: 'billing', pageType: PageType.listing },
        }}
      />
      <Route
        path={subRoutes.generalInformation}
        Component={GeneralInformationPage}
        handle={{
          tracking: { pageName: 'general-information', pageType: PageType.dashboard },
        }}
      >
        <Route path={subRoutes.terminate} Component={TerminateServicePage} />
      </Route>
      <Route
        path={subRoutes.vaults}
        Component={VaultsPage}
        handle={{
          tracking: { pageName: 'vaults', pageType: PageType.listing },
        }}
      >
        {/* Modale enfant : elle se superpose à la liste, qui reste montée derrière. */}
        <Route
          path={vaultCredentialsRoutePath}
          Component={VaultCredentialsPage}
          handle={{
            tracking: { pageName: 'vault-credentials', pageType: PageType.popup },
          }}
        />
      </Route>
    </Route>
  </>
);
