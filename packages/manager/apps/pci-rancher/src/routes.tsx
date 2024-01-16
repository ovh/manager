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
    path: '/pci',
    ...lazyRouteConfig(() => import('@/pages/Layout')),
    children: [
      {
        path: 'projects/:projectId',
        ...lazyRouteConfig(() => import('@/pages/Layout')),
        children: [
          {
            path: 'rancher',
            ...lazyRouteConfig(() => import('@/pages/')),
          },
          {
            path: 'rancher/onboarding',
            ...lazyRouteConfig(() => import('@/pages/onboarding')),
          },
          {
            // http://localhost:9000/#/pci-rancher/pci/projects/039db9ba696a4072a33074fa63ffa831/rancher/222ce105-a3f7-44c4-a7d3-dbb5983c045d
            path: 'rancher/:rancherId',
            ...lazyRouteConfig(() => import('@/pages/overview')),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
