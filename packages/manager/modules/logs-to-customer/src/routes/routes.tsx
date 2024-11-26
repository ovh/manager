import { RouteObject } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';

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
    ...lazyRouteConfig(() => import('../pages/logs/Logs.page')),
    handle: {
      tracking: {
        pageName: 'logs_access',
        pageType: PageType.dashboard,
      },
    },
    children: [
      {
        path: `subscription/:subscriptionId/terminate`,
        ...lazyRouteConfig(() =>
          import('../pages/logs/Logs-Subscription-terminate.page'),
        ),
      },
    ],
  },
  {
    path: 'streams',
    ...lazyRouteConfig(() => import('../pages/data-streams/DataStreams.page')),
    handle: {
      tracking: {
        pageName: 'log_subscriptions',
        pageType: PageType.dashboard,
      },
    },
  },
];
