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
    ...lazyRouteConfig(() => import('@/pages/index')),
    children: [
      {
        id: 'server',
        path: urls.server,
        ...lazyRouteConfig(() => import('@/pages/server')),
        handle: {
          tracking: {
            pageName: 'server',
            pageType: PageType.listing,
          },
        },
      },
      {
        id: 'cluster',
        path: urls.cluster,
        ...lazyRouteConfig(() => import('@/pages/cluster')),
        handle: {
          tracking: {
            pageName: 'cluster',
            pageType: PageType.listing,
          },
        },
      },
    ],
  },
  {
    id: 'onboarding',
    path: urls.onboarding,
    ...lazyRouteConfig(() => import('@/pages/onboarding')),
    handle: {
      tracking: {
        pageName: 'onboarding',
        pageType: PageType.onboarding,
      },
    },
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
