import React from 'react';

import { Route } from 'react-router-dom';

import { PageType } from '@ovh-ux/manager-react-shell-client';

import { subRoutes, urlParams } from './routes.constants';

const OnboardingGuardPage = React.lazy(() => import('@/pages/onboarding/OnboardingGuard.page'));
const OrderPage = React.lazy(() => import('@/pages/order/Order.page'));
const ServiceLayoutPage = React.lazy(() => import('@/pages/service/ServiceLayout.page'));
const LinkedServersPage = React.lazy(() => import('@/pages/linked-servers/LinkedServers.page'));
const EditBackupServerPage = React.lazy(
  () => import('@/pages/linked-servers/edit/EditBackupServer.page'),
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
    {/* Route de layout sans path : la barre d'onglets n'est montée qu'une fois, et les
        onglets 1.2/1.3/1.4 n'auront qu'à s'ajouter en enfants. */}
    <Route element={<ServiceLayoutPage />}>
      <Route
        path={subRoutes.linkedServers}
        Component={LinkedServersPage}
        handle={{
          tracking: { pageName: 'linked-servers', pageType: PageType.listing },
        }}
      />
      {/* TODO(1.2/1.3/1.4) : routes vaults / billing / general-information. */}
    </Route>
  </>
);
