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

export const routes: any = [
  {
    path: urls.root,
    ...lazyRouteConfig(() => import('@/pages/listing/index')),
    children: [
      {
        id: 'server',
        path: urls.server,
        ...lazyRouteConfig(() => import('@/pages/listing/server')),
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
        ...lazyRouteConfig(() => import('@/pages/listing/cluster')),
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
