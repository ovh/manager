import React from 'react';

import { Navigate, Route } from 'react-router-dom';

import { ErrorBoundary } from '@ovh-ux/manager-react-components';

import NotFound from '@/pages/not-found/404.page';

import { redirectionApp, subroutes, urls } from './Routes.constants';

const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));

const DashboardsPage = React.lazy(() => import('@/pages/dashboards/Dashboards.page'));

const TenantsLayoutPage = React.lazy(() => import('@/pages/tenants/Tenants.layout'));
const TenantsPage = React.lazy(() => import('@/pages/tenants/TenantsListing.page'));
const OnboardingTenantPage = React.lazy(() => import('@/pages/tenants/TenantsOnboarding.page'));
const OnboardingServicePage = React.lazy(() => import('@/pages/metrics/OnboardingService.page'));

export default (
  <>
    <Route path="/" element={<Navigate to={urls.root} replace />} />

    {/* Rooted application layout */}
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
      {/* Default landing inside root → redirect to Dashboards */}
      <Route index element={<Navigate to={urls.dashboards} replace />} />

      {/* Dashboards route */}
      <Route
        path={subroutes.dashboards}
        Component={DashboardsPage}
        handle={{
          tracking: {
            pageName: 'dashboards',
          },
        }}
      />

      {/* Metrics route */}
      <Route path={subroutes.metrics} Component={TenantsLayoutPage}>
        {/* Default landing inside root → redirect to Dashboards */}
        <Route index element={<Navigate to={urls.tenants} replace />} />
        {/* Onboarding observability service */}
        <Route
          path={subroutes.onboarding}
          Component={OnboardingServicePage}
          handle={{
            tracking: {
              pageName: 'onboarding',
            },
          }}
        />
        {/* Tenants routes */}
        <Route path={subroutes.tenants}>
          <Route
            index
            Component={TenantsPage}
            handle={{
              tracking: {
                pageName: 'tenants',
              },
            }}
          />
          <Route
            path={subroutes.onboarding}
            Component={OnboardingTenantPage}
            handle={{
              tracking: {
                pageName: 'tenants-onboarding',
              },
            }}
          />
        </Route>
      </Route>

      {/* Catch-all 404 route inside the app */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </>
);
