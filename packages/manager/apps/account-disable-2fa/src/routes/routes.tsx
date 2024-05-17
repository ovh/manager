import React from 'react';
import NotFound from '../pages/404';
import { createRoutePath, seeRoutePath } from '@/routes/home.constants';

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

export const Routes: any = [
  {
    path: '/',
    ...lazyRouteConfig(() => import('@/pages/Home.page')),
    children: [
      {
        path: createRoutePath,
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
        path: seeRoutePath,
        ...lazyRouteConfig(() => import('@/pages/see/See.page')),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
