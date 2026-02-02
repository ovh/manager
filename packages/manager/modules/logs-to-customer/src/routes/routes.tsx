import React, { ComponentType, lazy } from 'react';

import { Route, Routes } from 'react-router-dom';

import { PageType } from '@ovh-ux/manager-react-shell-client';

const logsPage = lazy(() => import('@/pages/logs/Logs.page'));
const logsDataStreamsPage = lazy(() => import('@/pages/data-streams/DataStreams.page'));
const logsTerminateSubscriptionPage = lazy(
  () => import('@/pages/logs/LogsSubscriptionTerminate.page'),
);

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

export const LogsToCustomerRoutes = () => (
  <Routes>
    <Route
      path=""
      Component={logsPage}
      handle={{
        tracking: {
          pageName: 'logs_access',
          pageType: PageType.dashboard,
        },
      }}
    >
      <Route
        path="subscription/:subscriptionId/terminate"
        Component={logsTerminateSubscriptionPage}
      />
    </Route>
    <Route
      path="streams"
      Component={logsDataStreamsPage}
      handle={{
        tracking: {
          pageName: 'log_subscriptions',
          pageType: PageType.dashboard,
        },
      }}
    />
  </Routes>
);
