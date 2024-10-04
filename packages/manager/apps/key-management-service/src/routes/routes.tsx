import React from 'react';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import NotFound from '../pages/404';
import { ROUTES_URLS } from './routes.constants';

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

export const COMMON_PATH = '/key-management-service';

export default [
  {
    path: ROUTES_URLS.root,
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        path: ROUTES_URLS.listing,
        ...lazyRouteConfig(() => import('@/pages/listing')),
        handle: {
          tracking: {
            pageName: '',
            pageType: PageType.listing,
          },
        },
        children: [
          {
            path: `${ROUTES_URLS.terminateOkms}/${ROUTES_URLS.okmsId}`,
            ...lazyRouteConfig(() =>
              import('@/pages/listing/terminate/TerminateKms'),
            ),
            handle: {
              tracking: {
                pageName: 'terminate',
                pageType: PageType.popup,
              },
            },
          },
        ],
      },
      {
        path: ROUTES_URLS.createKeyManagementService,
        ...lazyRouteConfig(() => import('@/pages/create')),
        handle: {
          tracking: {
            pageName: 'create_kms',
            pageType: PageType.funnel,
          },
        },
      },
      {
        path: ROUTES_URLS.onboarding,
        ...lazyRouteConfig(() => import('@/pages/onboarding')),
        handle: {
          tracking: {
            pageName: 'onboarding',
            pageType: PageType.onboarding,
          },
        },
      },
      {
        path: ROUTES_URLS.okmsId,
        ...lazyRouteConfig(() => import('@/pages/dashboard')),
        children: [
          {
            path: '',
            ...lazyRouteConfig(() =>
              import(
                '@/pages/dashboard/generalInformations/GeneralInformations'
              ),
            ),
            handle: {
              tracking: {
                pageName: 'general_informations',
                pageType: PageType.dashboard,
              },
            },
          },
          {
            path: ROUTES_URLS.keys,
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/serviceKeyList/serviceKeyList.page'),
            ),
            children: [
              {
                path: `${ROUTES_URLS.serviceKeyDeactivate}/${ROUTES_URLS.keyId}`,
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/serviceKey/deactivateServiceKeyModal/deactivateServiceKeyModal.page'
                  ),
                ),
              },
            ],
          },
        ],
      },
      {
        path: `${ROUTES_URLS.okmsId}/${ROUTES_URLS.keys}/${ROUTES_URLS.createKmsServiceKey}`,
        ...lazyRouteConfig(() => import('@/pages/serviceKey/createKey.page')),
      },
      {
        path: `${ROUTES_URLS.okmsId}/${ROUTES_URLS.keys}/${ROUTES_URLS.keyId}`,
        ...lazyRouteConfig(() => import('@/pages/serviceKey/serviceKey.page')),
        children: [
          {
            path: ROUTES_URLS.serviceKeyEditName,
            ...lazyRouteConfig(() =>
              import(
                '@/pages/serviceKey/editServiceKeyNameModal/editServiceKeyNameModal.page'
              ),
            ),
          },
          {
            path: ROUTES_URLS.serviceKeyDeactivate,
            ...lazyRouteConfig(() =>
              import(
                '@/pages/serviceKey/deactivateServiceKeyModal/deactivateServiceKeyModal.page'
              ),
            ),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
