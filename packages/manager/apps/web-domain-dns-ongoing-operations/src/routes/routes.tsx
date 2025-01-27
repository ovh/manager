import React from 'react';
import { RouteObject } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import NotFound from '@/pages/404';
import { urls } from '@/routes/routes.constant';

const lazyRouteConfig = (importFn: CallableFunction): Partial<RouteObject> => {
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

export const Routes: any = [
  {
    path: urls.root,
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        path: urls.root,
        ...lazyRouteConfig(() => import('@/pages/dashboard')),
        children: [
          {
            id: 'dashboard.domain',
            path: urls.domain,
            ...lazyRouteConfig(() => import('@/pages/dashboard/domain')),
            handle: {
              tracking: {
                pageName: 'domain',
                pageType: PageType.dashboard,
              },
            },
          },
          {
            id: 'dashboard.dns',
            path: urls.dns,
            ...lazyRouteConfig(() => import('@/pages/dashboard/dns')),
            handle: {
              tracking: {
                pageName: 'dns',
                pageType: PageType.dashboard,
              },
            },
          },
        ],
      },
      {
        id: 'track',
        path: urls.track,
        ...lazyRouteConfig(() => import('@/pages/tracking')),
      },
      {
        id: 'upload',
        path: urls.upload,
        ...lazyRouteConfig(() => import('@/pages/upload')),
      },
      {
        id: '404',
        path: urls.error404,
        ...lazyRouteConfig(() => import('@/pages/404'))
      }
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
