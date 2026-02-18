import { lazy } from 'react';

import { Route } from 'react-router-dom';

import { subroutes, urls } from '@/routes/Routes.constants';

const importMetricsDashboardPage = () => import('@/pages/metrics/dashboards/Dashboard.page');
const importMetricsDashboardWidgetModal = () =>
  import('@/pages/metrics/dashboards/DashboardWidgetModal.page');

const importMetricsSubscriptionsManageConfigurationPage = () =>
  import('@/pages/metrics/tenants/subscriptions/ConfigSubscriptions.page');

const metricsDashboardPage = lazy(importMetricsDashboardPage);
const metricsDashboardWidgetModal = lazy(importMetricsDashboardWidgetModal);

const metricsSubscriptionsManageConfigurationPage = lazy(
  importMetricsSubscriptionsManageConfigurationPage,
);

export const getMetricsToCustomerRoutes = () => (
  <Route path={urls.base}>
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
  </Route>
);

export default getMetricsToCustomerRoutes;
