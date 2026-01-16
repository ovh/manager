import { lazy } from 'react';

import { Route } from 'react-router-dom';

import { subroutes, urls } from '@/routes/Routes.constants';

const importMetricsDashboardPage = () => import('@/pages/metrics/dashboards/Dashboard.page');
const importMetricsDashboardWidgetModal = () =>
  import('@/pages/metrics/dashboards/DashboardWidgetModal.page');

const metricsDashboardPage = lazy(importMetricsDashboardPage);
const metricsDashboardWidgetModal = lazy(importMetricsDashboardWidgetModal);

export const getMetricsToCustomerRoutes = () => (
  <Route path={urls.root} id="dashboards" Component={metricsDashboardPage}>
    <Route
      path={subroutes.dashboardWidget}
      id="dashboard-widget"
      Component={metricsDashboardWidgetModal}
    />
  </Route>
);

export default getMetricsToCustomerRoutes;
