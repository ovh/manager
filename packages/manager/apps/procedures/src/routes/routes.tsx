import React from 'react';
import NotFound from '../pages/404';
import {
  createRoutePath,
  errorRoutePath,
  seeRoutePath,
} from '@/routes/mfa.constants';

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

export const accountDisable2faRoute = '/account-disable-2fa';
export const exercisingYourRightsRoute = '/exercising-your-rights';

export const Routes: any = [
  {
    path: accountDisable2faRoute,
    ...lazyRouteConfig(() => import('@/pages/disableMFA/DisableMFA.page')),
    children: [
      {
        path: `${accountDisable2faRoute}/${createRoutePath}`,
        ...lazyRouteConfig(() =>
          import('@/pages/disableMFA/create/Create.page'),
        ),
        children: [
          {
            path: 'confirm',
            ...lazyRouteConfig(() =>
              import('@/pages/disableMFA/create/confirm/Confirm.page'),
            ),
          },
          {
            path: '',
            ...lazyRouteConfig(() =>
              import('@/pages/disableMFA/create/form/Form.page'),
            ),
          },
        ],
      },
      {
        path: `${accountDisable2faRoute}/${seeRoutePath}`,
        ...lazyRouteConfig(() => import('@/pages/disableMFA/see/See.page')),
      },
      {
        path: `${accountDisable2faRoute}/${errorRoutePath}`,
        ...lazyRouteConfig(() => import('@/pages/disableMFA/error/Error.page')),
      },
    ],
  },
  {
    path: exercisingYourRightsRoute,
    ...lazyRouteConfig(() => import('@/pages/rgdp/RGDP.page')),
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
