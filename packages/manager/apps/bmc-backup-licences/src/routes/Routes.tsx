import React from 'react';

import { Navigate, Route } from 'react-router-dom';

import { BackupLicencesRoutes } from '@ovh-ux/backup-licences';
import { urls as BackupLicencesUrls } from '@ovh-ux/backup-licences/routes/routes.constants';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { PageType } from '@ovh-ux/manager-react-shell-client';

import NotFound from '@/pages/not-found/404.page';

import { redirectionApp, subRoutes, urls } from './Routes.constants';

const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));
const OnboardingPage = React.lazy(() => import('@/pages/onboarding/Onboarding.page'));

export default (
  <>
    <Route path="/" element={<Navigate to={BackupLicencesUrls.onboarding} replace />} />
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
      {BackupLicencesRoutes}
      <Route path="*" element={<NotFound />} />
    </Route>
  </>
);
