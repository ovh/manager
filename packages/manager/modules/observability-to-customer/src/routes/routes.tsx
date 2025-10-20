import { ComponentType, lazy } from 'react';

import { Route, RouteObject } from 'react-router-dom';

const importMetricsOverviewPage = () => import('../pages/metric/overview.page');

const importMetricsDashboardPage = () => import('../pages/metric/dashboard.page');

const importMetricsDashboardWidgetModal = () => import('../pages/metric/dashboard-widget.modal');

const metricsOverviewPage = lazy(importMetricsOverviewPage);
const metricsDashboardPage = lazy(importMetricsDashboardPage);

const metricsDashboardWidgetModal = lazy(importMetricsDashboardWidgetModal);

type ModuleWithDefault<T extends ComponentType<unknown>, E extends object> = {
  default: T;
} & E;

export function lazyRouteConfig<T extends ComponentType<unknown>, E extends object = object>(
  importFn: () => Promise<ModuleWithDefault<T, E>>,
) {
  return {
    lazy: async () => {
      const { default: Component, ...rest } = await importFn();

      return {
        Component,
        ...(rest as E),
      };
    },
  };
}

export const observabilityRoutes: RouteObject[] = [
  {
    path: 'overview',
    ...lazyRouteConfig(importMetricsOverviewPage),
  },
  {
    path: ':serviceName/:productType',
    ...lazyRouteConfig(importMetricsDashboardPage),
    children: [
      {
        path: ':widgetId',
        ...lazyRouteConfig(importMetricsDashboardWidgetModal),
      },
    ],
  },
];

export const getObservabilityRoute = () => (
  <>
    <Route path="overview" id="overview" Component={metricsOverviewPage} />

    <Route path=":serviceName">
      <Route path=":productType" id="dashboard" Component={metricsDashboardPage}>
        <Route path=":widgetId" id="dashboard-widget" Component={metricsDashboardWidgetModal} />
      </Route>
    </Route>
  </>
);
