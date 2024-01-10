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

export default [
  {
    // http://localhost:9000/#/pci-rancher/
    path: '/',
    ...lazyRouteConfig(() => import('@/pages')),
  },
  {
    // http://localhost:9000/#/pci-rancher/onboarding
    path: '/pci/projects/:projectId/rancher/onboarding',
    ...lazyRouteConfig(() => import('@/pages/onboarding')),
  },
  {
    // http://localhost:9000/#/pci-rancher/pci/projects/039db9ba696a4072a33074fa63ffa831/rancher
    path: '/pci/projects/:projectId/rancher',
    ...lazyRouteConfig(() => import('@/pages')),
    children: [
      {
        path: '',
        ...lazyRouteConfig(() =>
          import('@/pages/dashboard/[serviceName]/_layout'),
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
