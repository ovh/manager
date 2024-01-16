import React from 'react';
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

export const COMMON_PATH = '/pci/projects';

export default [
  {
    // http://localhost:9000/#/pci-rancher/
    path: '/',
    ...lazyRouteConfig(() => import('@/pages')),
  },
  {
    // http://localhost:9000/#/pci-rancher/onboarding
    path: `${COMMON_PATH}/:projectId/rancher/onboarding`,
    ...lazyRouteConfig(() => import('@/pages/onboarding')),
  },
  {
    // http://localhost:9000/#/pci-rancher/pci/projects/039db9ba696a4072a33074fa63ffa831/rancher
    path: `${COMMON_PATH}/:projectId/rancher`,
    ...lazyRouteConfig(() => import('@/pages')),
  },
  {
    // http://localhost:9000/#/pci-rancher/pci/projects/039db9ba696a4072a33074fa63ffa831/rancher/d6b6579e-8d60-4487-bf08-8b4ddf98f7d3
    path: `${COMMON_PATH}/:projectId/rancher/:rancherId`,
    ...lazyRouteConfig(() => import('@/pages/dashboard/_layout')),
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
