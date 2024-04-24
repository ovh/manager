import React from 'react';
import { RouteObject } from 'react-router-dom';
import i18next from 'i18next';
import NotFound from '@/pages/404';

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
    path: '',
    handle: { breadcrumb: (): string => 'Zimbra' },
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        path: ':serviceName',
        ...lazyRouteConfig(() => import('@/pages/dashboard/_layout')),
        children: [
          {
            path: '',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/GeneralInformation'),
            ),
            handle: {
              breadcrumb: (): null => null,
            },
          },
          {
            path: 'organizations',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/Organizations/Organizations'),
            ),
            handle: {
              breadcrumb: (): string => i18next.t('dashboard:organization'),
            },
          },
          {
            path: 'domains',
            ...lazyRouteConfig(() => import('@/pages/dashboard/Domains')),
            handle: {
              breadcrumb: (): string => i18next.t('dashboard:domain'),
            },
          },
          {
            path: 'email_accounts',
            ...lazyRouteConfig(() => import('@/pages/dashboard/EmailAccounts')),
            handle: {
              breadcrumb: (): string => i18next.t('dashboard:email_accounts'),
            },
          },
        ],
      },
      {
        path: 'onboarding',
        ...lazyRouteConfig(() => import('@/pages/onboarding')),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
