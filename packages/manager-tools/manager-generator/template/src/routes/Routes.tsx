import React from 'react';

import { Navigate, Route } from 'react-router-dom';

import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { PageType } from '@ovh-ux/manager-react-shell-client';

import { appName } from '@/App.constants';
import NotFound from '@/pages/not-found/404.page';
import { subRoutes, urls } from '@/routes/Routes.constant';

const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));
const DashboardPage = React.lazy(() => import('@/pages/dashboard/DashboardListing.page'));
const DashboardOverviewPage = React.lazy(
  () => import('@/pages/dashboard-overview/DashboardOverview.page'),
);
const DashboardSettingsPage = React.lazy(
  () => import('@/pages/dashboard-settings/DashboardSettings.page'),
);
const OnboardingPage = React.lazy(() => import('@/pages/onboarding/Onboarding.page'));

export default (
  <Route
    id="root"
    path={`${urls.root}/*`}
    Component={MainLayoutPage}
    errorElement={
      <ErrorBoundary redirectionApp={appName} isPreloaderHide={true} isRouteShellSync={true} />
    }
  >
    {/* Index route for /full-demo/ */}
    <Route index element={<Navigate to="dashboard" replace />} />

    {/* Onboarding */}
    <Route
      id={`${appName}.onboarding`}
      path={urls.onboarding}
      Component={OnboardingPage}
      handle={{
        tracking: {
          pageName: `${appName}.onboarding`,
          pageType: PageType.onboarding,
        },
      }}
    />

    {/* Dashboard */}
    <Route path={urls.dashboard} Component={DashboardPage}>
      <Route
        index
        id={`${appName}.dashboard-overview`}
        Component={DashboardOverviewPage}
        handle={{
          tracking: {
            pageName: `${appName}.dashboard-overview`,
            pageType: PageType.listing,
          },
        }}
      />
      <Route
        id={`${appName}.dashboard-settings`}
        path={subRoutes.settings}
        Component={DashboardSettingsPage}
        handle={{
          tracking: {
            pageName: `${appName}.dashboard-settings`,
            pageType: PageType.dashboard,
          },
        }}
      />
    </Route>

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Route>
);
