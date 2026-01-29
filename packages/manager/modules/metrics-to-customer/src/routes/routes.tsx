import { lazy } from 'react';

import { Route } from 'react-router-dom';

import { subroutes, urls } from '@/routes/Routes.constants';

const importMetricsDashboardPage = () => import('@/pages/metrics/dashboards/Dashboard.page');
const importMetricsDashboardWidgetModal = () =>
  import('@/pages/metrics/dashboards/DashboardWidgetModal.page');

const importMetricsSubscriptionsManageConfigurationPage = () =>
  import('@/pages/metrics/tenants/subscriptions/ConfigSubscriptions.page');

const importLogsPage = () => import('@/pages/logs/Logs.page');

const metricsDashboardPage = lazy(importMetricsDashboardPage);
const metricsDashboardWidgetModal = lazy(importMetricsDashboardWidgetModal);

const metricsSubscriptionsManageConfigurationPage = lazy(
  importMetricsSubscriptionsManageConfigurationPage,
);

const logsPage = lazy(importLogsPage);

export const getMetricsToCustomerRoutes = () => (
  <Route path={urls.root}>
    {/* Metrics */}
    <Route path={subroutes.metrics} Component={metricsDashboardPage}>
      <Route
        path={subroutes.dashboardWidget}
        Component={metricsDashboardWidgetModal}
        index={true}
      />
      <Route
        path={urls.subscriptionsConfig}
        Component={metricsSubscriptionsManageConfigurationPage}
      />
    </Route>
    {/* Logs */}
    <Route path={subroutes.logs} Component={logsPage} />
  </Route>
);

export default getMetricsToCustomerRoutes;
