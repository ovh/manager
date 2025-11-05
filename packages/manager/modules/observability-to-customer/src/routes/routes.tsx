import { ComponentType, lazy } from 'react';

import { Route, RouteObject } from 'react-router-dom';

const importMetricsOverviewPage = () => import('../pages/metric/overview.page');
const importMetricsDashboardPage = () => import('../pages/metric/dashboard.page');
const importMetricsDashboardWidgetModal = () => import('../pages/metric/dashboard-widget.modal');

const metricsOverviewPage = lazy(importMetricsOverviewPage);
const metricsDashboardPage = lazy(importMetricsDashboardPage);
const metricsDashboardWidgetModal = lazy(importMetricsDashboardWidgetModal);

type ModuleWithDefault<T extends ComponentType<unknown>, E extends Record<string, unknown>> = {
  default: T;
} & E;

function lazyRouteConfig<
  T extends ComponentType<unknown>,
  E extends Record<string, unknown> = Record<string, unknown>,
>(importFn: () => Promise<ModuleWithDefault<T, E>>) {
  return {
    lazy: async () => {
      const { default: Component, ...rest } = await importFn();

      return {
        Component,
        ...(rest as unknown as E),
      };
    },
  };
}

/**
 * @deprecated This export is deprecated. Please use getObservabilityRoute() instead.
 */
export const observabilityRoutes: RouteObject[] = [
  {
    path: 'overview',
    ...lazyRouteConfig(importMetricsOverviewPage),
  },
  {
    path: '',
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
    <Route path="" id="dashboard" Component={metricsDashboardPage}>
      <Route path=":widgetId" id="dashboard-widget" Component={metricsDashboardWidgetModal} />
    </Route>
  </>
);

export default getObservabilityRoute;
