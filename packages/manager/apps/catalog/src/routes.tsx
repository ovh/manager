import React from 'react';
import { RouteObject } from 'react-router-dom';
import NotFound from './pages/404';

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

export const routes: RouteObject[] = [
  {
    path: '/',
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        path: '/',
        ...lazyRouteConfig(() => import('@/pages/index')),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
