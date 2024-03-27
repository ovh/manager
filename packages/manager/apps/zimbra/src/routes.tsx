import React from 'react';
import i18next from 'i18next';
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

export default [
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
            ...lazyRouteConfig(() => import('@/pages/dashboard/Organizations')),
            handle: {
              breadcrumb: (): string =>
                i18next.t('zimbra/dashboard:organization'),
            },
          },
          {
            path: 'domains',
            ...lazyRouteConfig(() => import('@/pages/dashboard/Domains')),
            handle: {
              breadcrumb: (): string => i18next.t('zimbra/dashboard:domain'),
            },
          },
          {
            path: 'email-accounts',
            ...lazyRouteConfig(() => import('@/pages/dashboard/EmailAccounts')),
            handle: {
              breadcrumb: (): string =>
                i18next.t('zimbra/dashboard:email_accounts'),
            },
          },
          {
            path: 'mailing-lists',
            ...lazyRouteConfig(() => import('@/pages/dashboard/MailingLists')),
            handle: {
              breadcrumb: (): string =>
                i18next.t('zimbra/dashboard:mailing_list'),
            },
          },
          {
            path: 'redirections',
            ...lazyRouteConfig(() => import('@/pages/dashboard/Redirections')),
            handle: {
              breadcrumb: (): string =>
                i18next.t('zimbra/dashboard:redirections'),
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
