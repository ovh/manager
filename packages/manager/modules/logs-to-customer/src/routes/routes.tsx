import { PageType } from '@ovh-ux/manager-react-shell-client';
import React, { lazy } from 'react';
import { Route, RouteObject } from 'react-router-dom';

const importLogsPage = () => import('../pages/logs/Logs.page');
const importLogsDataStreamsPage = () =>
  import('../pages/data-streams/DataStreams.page');
const importLogsTerminateSubscriptionPage = () =>
  import('../pages/logs/Logs-Subscription-terminate.page');

const logsPage = lazy(importLogsPage);
const logsDataStreamsPage = lazy(importLogsDataStreamsPage);
const logsTerminateSubscriptionPage = lazy(importLogsTerminateSubscriptionPage);

const lazyRouteConfig = (importFn: CallableFunction) => {
  return {
    lazy: async () => {
      const { default: moduleDefault, ...moduleExports } = await importFn();

      return {
        Component: moduleDefault,
        ...moduleExports,
      };
    },
  };
};

export const logsRoutes: RouteObject[] = [
  {
    path: '',
    ...lazyRouteConfig(importLogsPage),
    handle: {
      tracking: {
        pageName: 'logs_access',
        pageType: PageType.dashboard,
      },
    },
    children: [
      {
        path: `subscription/:subscriptionId/terminate`,
        ...lazyRouteConfig(importLogsTerminateSubscriptionPage),
      },
    ],
  },
  {
    path: 'streams',
    ...lazyRouteConfig(importLogsDataStreamsPage),
    handle: {
      tracking: {
        pageName: 'log_subscriptions',
        pageType: PageType.dashboard,
      },
    },
  },
];

export const getLogsRoute = () => (
  <>
    <Route
      path=""
      id="logs-tail"
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
        id="logs-terminate-subscription"
        Component={logsTerminateSubscriptionPage}
      />
    </Route>
    <Route
      path="streams"
      id="data-streams"
      Component={logsDataStreamsPage}
      handle={{
        tracking: {
          pageName: 'log_subscriptions',
          pageType: PageType.dashboard,
        },
      }}
    />
  </>
);
