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

export const Routes: any = [
  {
    path: '/',
    ...lazyRouteConfig(() => import('@/pages/Home.page')),
    children: [
      {
        path: 'create',
        ...lazyRouteConfig(() => import('@/pages/create/Create.page')),
        children: [
          {
            path: 'confirm',
            ...lazyRouteConfig(() =>
              import('@/pages/create/confirm/Confirm.page'),
            ),
          },
        ],
      },
      {
        path: 'see',
        ...lazyRouteConfig(() => import('@/pages/see/See.page')),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
