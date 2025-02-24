import React from 'react';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import NotFound from '@/pages/404';
import { urls } from '@/routes/routes.constant';

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

export const Routes = [
  {
    path: urls.root,
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        path: urls.root,
        ...lazyRouteConfig(() => import('@/pages/dashboard/Dashboard')),
        children: [
          {
            id: 'dashboard.domain',
            path: urls.domain,
            ...lazyRouteConfig(() => import('@/pages/dashboard/domain/Domain')),
            handle: {
              tracking: {
                pageName: 'domain',
                pageType: PageType.dashboard,
              },
            },
          },
        ],
      },
      {
        id: 'track',
        path: urls.track,
        ...lazyRouteConfig(() => import('@/pages/tracking/Tracking')),
      },
      {
        id: 'upload',
        path: urls.upload,
        ...lazyRouteConfig(() => import('@/pages/upload/Upload')),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
