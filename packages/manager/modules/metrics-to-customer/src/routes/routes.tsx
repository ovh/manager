import { ComponentType, lazy } from 'react';

import { Route, RouteObject } from 'react-router-dom';

const importMetricsDashboardPage = () => import('../pages/metric/Dashboard.page');
const importMetricsDashboardWidgetModal = () => import('../pages/metric/DashboardWidgetModal.page');

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
 * @deprecated This export is deprecated. Please use getMetricsRoute() instead.
 */
export const MetricsToCustomerRoutes: RouteObject[] = [
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

export const getMetricsToCustomerRoutes = () => (
  <>
    <Route path="" id="dashboard" Component={metricsDashboardPage}>
      <Route path=":widgetId" id="dashboard-widget" Component={metricsDashboardWidgetModal} />
    </Route>
  </>
);

export default getMetricsToCustomerRoutes;
