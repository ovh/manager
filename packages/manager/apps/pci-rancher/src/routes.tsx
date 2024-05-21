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
    path: '/pci/projects/:projectId',
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        path: 'rancher',
        ...lazyRouteConfig(() => import('@/pages/')),
        children: [
          {
            path: ':rancherId/delete',
            ...lazyRouteConfig(() =>
              import('@/pages/listing/delete/DeleteRancherModal'),
            ),
          },
        ],
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
        path: 'rancher/:rancherId',
        ...lazyRouteConfig(() => import('@/pages/dashboard')),
        children: [
          {
            path: 'edit',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/edit-modal/EditModal'),
            ),
          },
          {
            path: 'generate-access',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/generate-access/GenerateAccessModal'),
            ),
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
