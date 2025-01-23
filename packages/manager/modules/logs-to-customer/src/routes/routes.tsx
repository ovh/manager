import { RouteObject } from 'react-router-dom';

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
    ...lazyRouteConfig(() => import('../pages/data-streams/Data-streams.page')),
  },
];
