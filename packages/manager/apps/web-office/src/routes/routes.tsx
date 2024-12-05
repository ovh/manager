import React from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import NotFound from '@/pages/404';
import { urls } from '@/routes/routes.constants';

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
    path: urls.listing,
    element: <Navigate to={urls.license} />,
  },
  {
    path: urls.license,
    ...lazyRouteConfig(() => import('@/pages/licences/licences.page')),
    handle: {
      tracking: {
        pageName: 'licenses',
        pageType: PageType.listing,
      },
    },
  },
  {
    path: urls.dashboard,
    ...lazyRouteConfig(() => import('@/pages/dashboard')),
    children: [
      {
        id: 'dashboard',
        path: '',
        ...lazyRouteConfig(() =>
          import('@/pages/dashboard/general-informations'),
        ),
        handle: {
          tracking: {
            pageName: 'dashboard',
            pageType: PageType.dashboard,
          },
        },
      },
      {
        id: 'dashboard.tab2',
        path: 'Tab2',
        ...lazyRouteConfig(() => import('@/pages/dashboard/tab2')),
        handle: {
          tracking: {
            pageName: 'tab2',
            pageType: PageType.dashboard,
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
