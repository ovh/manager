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
  <Route path={urls.root} Component={metricsDashboardPage}>
    <Route path={subroutes.dashboardWidget} Component={metricsDashboardWidgetModal} />
    <Route
      path={urls.subscriptionsConfig}
      Component={metricsSubscriptionsManageConfigurationPage}
    />
  </Route>
);

export default getMetricsToCustomerRoutes;
