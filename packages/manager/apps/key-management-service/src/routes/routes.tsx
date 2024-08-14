import React from 'react';
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
        children: [
          {
            path: `${ROUTES_URLS.terminateOkms}/${ROUTES_URLS.okmsId}`,
            ...lazyRouteConfig(() =>
              import('@/pages/listing/terminate/TerminateKms'),
            ),
          },
        ],
      },
      {
        path: ROUTES_URLS.createKeyManagementService,
        ...lazyRouteConfig(() => import('@/pages/create')),
      },
      {
        path: ROUTES_URLS.onboarding,
        ...lazyRouteConfig(() => import('@/pages/onboarding')),
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
          {
            path: ROUTES_URLS.credentials,
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/credentialList/credentialList.page'),
            ),
          },
        ],
      },
      {
        path: `${ROUTES_URLS.okmsId}/${ROUTES_URLS.keys}/${ROUTES_URLS.createKmsServiceKey}`,
        ...lazyRouteConfig(() => import('@/pages/serviceKey/createKey.page')),
      },
      {
        path: `${ROUTES_URLS.okmsId}/${ROUTES_URLS.credentials}/${ROUTES_URLS.createCredential}`,
        ...lazyRouteConfig(() =>
          import('@/pages/credential/createCredential.page'),
        ),
      },
      {
        path: `${ROUTES_URLS.okmsId}/${ROUTES_URLS.credentials}/${ROUTES_URLS.credentialId}`,
        ...lazyRouteConfig(() => import('@/pages/credential/credential.page')),
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
