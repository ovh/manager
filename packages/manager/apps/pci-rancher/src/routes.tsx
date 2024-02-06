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
    path: '/pci',
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        path: 'projects/:projectId',
        ...lazyRouteConfig(() => import('@/pages/layout')),
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
            path: 'rancher/new',
            ...lazyRouteConfig(() => import('@/pages/create')),
          },
          {
            // http://localhost:9000/#/public-cloud/pci/projects/039db9ba696a4072a33074fa63ffa831/rancher/222ce105-a3f7-44c4-a7d3-dbb5983c045d
            path: 'rancher/:rancherId',
            ...lazyRouteConfig(() => import('@/pages/dashboard/_layout')),
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
