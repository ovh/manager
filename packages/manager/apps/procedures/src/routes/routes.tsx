import React from 'react';
import NotFound from '../pages/404';
import {
  createRoutePath,
  errorRoutePath,
  seeRoutePath,
} from '@/routes/home.constants';

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

export const rootRoute = '/account-disable-2fa';

export const Routes: any = [
  {
    path: rootRoute,
    ...lazyRouteConfig(() => import('@/pages/Home.page')),
    children: [
      {
        path: `${rootRoute}/${createRoutePath}`,
        ...lazyRouteConfig(() => import('@/pages/create/Create.page')),
        children: [
          {
            path: 'confirm',
            ...lazyRouteConfig(() =>
              import('@/pages/create/confirm/Confirm.page'),
            ),
          },
          {
            path: '',
            ...lazyRouteConfig(() => import('@/pages/create/form/Form.page')),
          },
        ],
      },
      {
        path: `${rootRoute}/${seeRoutePath}`,
        ...lazyRouteConfig(() => import('@/pages/see/See.page')),
      },
      {
        path: `${rootRoute}/${errorRoutePath}`,
        ...lazyRouteConfig(() => import('@/pages/error/Error.page')),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
