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

export enum Route {
  Listing = 'listing',
  Dashboard = 'dashboard',
  Onboarding = 'onboarding',
  New = 'New',
}

export const getRequestTaggerPciPath = (project: string, route?: Route) =>
  `pci.projects.project.${project}${route ? `.${route}` : ''}`;

export default [
  {
    path: '/pci/projects/:projectId',
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        id: getRequestTaggerPciPath('rancher'),
        path: 'rancher',
        ...lazyRouteConfig(() => import('@/pages/')),
      },
      {
        id: getRequestTaggerPciPath('rancher', Route.Onboarding),
        path: 'rancher/onboarding',
        ...lazyRouteConfig(() => import('@/pages/onboarding')),
      },
      {
        id: getRequestTaggerPciPath('rancher', Route.New),
        path: 'rancher/new',
        ...lazyRouteConfig(() => import('@/pages/create')),
      },
      {
        id: getRequestTaggerPciPath('rancher', Route.Dashboard),
        path: 'rancher/:rancherId',
        ...lazyRouteConfig(() => import('@/pages/dashboard/_layout')),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
