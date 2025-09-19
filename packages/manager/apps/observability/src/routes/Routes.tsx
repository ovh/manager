import React from 'react';

import { Navigate, Route } from 'react-router-dom';

import { ErrorBoundary } from '@ovh-ux/manager-react-components';

import NotFound from '@/pages/not-found/404.page';

import { redirectionApp, MetricSubRoutes, urls } from './Routes.constants';

const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));

const DashboardsPage = React.lazy(() => import('@/pages/dashboards/Dashboards.page'));

const MetricsPage = React.lazy(() => import('@/pages/metrics/Metrics.page'));
const TenantsPage = React.lazy(() => import('@/pages/metrics/tenants/Tenants.page'));

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
        path={urls.dashboards}
        Component={DashboardsPage}
        handle={{
          tracking: {
            pageName: 'dashboards',
          },
        }}
      />

      {/* Metrics route */}
      <Route
        path={urls.metrics}
        Component={MetricsPage}
        handle={{
          tracking: {
            pageName: 'metrics',
          },
        }}
      >
        {/* Metrics subRoutes */}
        <Route
          path={MetricSubRoutes.tenants}
          Component={TenantsPage}
          handle={{
            tracking: {
              pageName: 'tenants',
            },
          }}
        />
      </Route>

      {/* Catch-all 404 route inside the app */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </>
);
