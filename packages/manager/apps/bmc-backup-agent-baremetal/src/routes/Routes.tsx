import React from 'react';

import { Navigate, Route } from 'react-router-dom';

import { BackupAgentRoutes } from '@ovh-ux/backup-agent';
import { urls as BackupAgentUrls } from '@ovh-ux/backup-agent/routes/routes.constants';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { PageType } from '@ovh-ux/manager-react-shell-client';

import NotFound from '@/pages/not-found/404.page';

import { redirectionApp, subRoutes, urlParams, urls } from './Routes.constants';

const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));
const OnboardingPage = React.lazy(() => import('@/pages/onboarding/Onboarding.page'));
const FirstOrderPage = React.lazy(() => import('@/pages/first-order/FirstOrder.page'));
const FirstOrderConfirmationModalPage = React.lazy(
  () => import('@/pages/first-order/confirmation/FirstOrderConfirmationModal.page'),
);

export default (
  <>
    <Route path="/" element={<Navigate to={BackupAgentUrls.dashboardTenant} replace />} />
    <Route
      id="root"
      path={urls.root}
      Component={MainLayoutPage}
      errorElement={
        <ErrorBoundary
          isPreloaderHide={true}
          isRouteShellSync={true}
          redirectionApp={redirectionApp}
        />
      }
    >
      <Route
        path={subRoutes.onboarding}
        Component={OnboardingPage}
        handle={{
          tracking: { pageName: 'onboarding', pageType: PageType.onboarding },
        }}
      />
      <Route
        path={subRoutes.firstOrder}
        Component={FirstOrderPage}
        handle={{
          tracking: { pageName: 'order', pageType: PageType.funnel },
        }}
      >
        <Route
          path={`${subRoutes.firstOrderConfirmation}/${urlParams.baremetalName}`}
          Component={FirstOrderConfirmationModalPage}
          handle={{
            tracking: { pageName: 'order-confirmation', pageType: PageType.funnel },
          }}
        />
      </Route>
      {BackupAgentRoutes}
      <Route path="*" element={<NotFound />} />
    </Route>
  </>
);
