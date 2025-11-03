import React, { ComponentType, lazy } from 'react';

import { Route, RouteObject } from 'react-router-dom';

import { PageType } from '@ovh-ux/manager-react-shell-client';

const importLogsPage = () => import('../pages/logs/Logs.page');
const importLogsDataStreamsPage = () =>
  import('../pages/data-streams/DataStreams.page');
const importLogsTerminateSubscriptionPage = () =>
  import('../pages/logs/Logs-Subscription-terminate.page');

const logsPage = lazy(importLogsPage);
const logsDataStreamsPage = lazy(importLogsDataStreamsPage);
const logsTerminateSubscriptionPage = lazy(importLogsTerminateSubscriptionPage);

type ModuleWithDefault<T extends ComponentType<unknown>, E extends object> = {
  default: T;
} & E;

export function lazyRouteConfig<
  T extends ComponentType<unknown>,
  E extends object = object
>(importFn: () => Promise<ModuleWithDefault<T, E>>) {
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
/**
 * Routes for the logs to customer module
 * @description This routes are used to display the logs to customer module in the dashboard
 * @returns {RouteObject[]} The routes for the logs to customer module
 * @deprecated Use the getLogsRoute function instead
 * @example
 * {
 *   path: '',
 *   ...lazyRouteConfig(importLogsPage),
 *   handle: {
 *     tracking: {
 *       pageName: 'logs_access',
 *       pageType: PageType.dashboard,
 *     },
 *   },
 *   children: [
 *     {
 *       path: `subscription/:subscriptionId/terminate`,
 *       ...lazyRouteConfig(importLogsTerminateSubscriptionPage),
 *     },
 *   ],
 * },
 */
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

/**
 * Route for the logs to customer module
 * @description This route is used to display the logs to customer module in the dashboard
 * @returns {JSX.Element} The logs route
 * @example
 * <Route
 *   path=""
 *   id="logs-tail"
 *   Component={logsPage}
 *   handle={{
 *     tracking: {
 *       pageName: 'logs_access',
 *       pageType: PageType.dashboard,
 *     },
 *   }}
 * >
 *   <Route
 *     path="subscription/:subscriptionId/terminate"
 *     id="logs-terminate-subscription"
 *     Component={logsTerminateSubscriptionPage}
 *   />
 *   <Route
 *     path="streams"
 *     id="data-streams"
 *     Component={logsDataStreamsPage}
 *     handle={{
 *       tracking: {
 *         pageName: 'log_subscriptions',
 *         pageType: PageType.dashboard,
 *       },
 *     }}
 *   />
 * </Route>
 * </>
 * );
 */
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
