import React from 'react';
import { logsRoutes } from '@ovh-ux/logs-to-customer';
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
            children: [
              {
                path: ROUTES_URLS.okmsUpdateName,
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/generalInformations/updateName/OkmsNameUpdateModal'
                  ),
                ),
                handle: {
                  tracking: {
                    pageName: 'rename_kms',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                path: ROUTES_URLS.terminateOkms,
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
            path: ROUTES_URLS.keys,
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/serviceKeyList/ServiceKeyList.page'),
            ),
            handle: {
              tracking: {
                pageName: 'encryption_keys',
                pageType: PageType.listing,
              },
            },
            children: [
              {
                path: `${ROUTES_URLS.serviceKeyDeactivate}/${ROUTES_URLS.keyId}`,
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/serviceKey/deactivateServiceKeyModal/DeactivateServiceKeyModal.page'
                  ),
                ),
                handle: {
                  tracking: {
                    pageName: 'deactivate_encryption_key',
                    pageType: PageType.popup,
                  },
                },
              },
            ],
          },
          {
            path: ROUTES_URLS.credentials,
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/credentialList/CredentialList.page'),
            ),
            handle: {
              tracking: {
                pageName: 'access_certificates',
                pageType: PageType.listing,
              },
            },
            children: [
              {
                path: `${ROUTES_URLS.credentialDelete}/${ROUTES_URLS.credentialId}`,
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/credentialList/delete/DeleteCredentialModal.page'
                  ),
                ),
                handle: {
                  tracking: {
                    pageName: 'delete_access_certificate',
                    pageType: PageType.popup,
                  },
                },
              },
            ],
          },
          {
            path: `${ROUTES_URLS.logs}/*`,
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/logs/Logs.page'),
            ),
            children: [...logsRoutes],
          },
        ],
      },
      {
        path: `${ROUTES_URLS.okmsId}/${ROUTES_URLS.keys}/${ROUTES_URLS.createKmsServiceKey}`,
        ...lazyRouteConfig(() => import('@/pages/serviceKey/CreateKey.page')),
        handle: {
          tracking: {
            pageName: 'create_encryption_key',
            pageType: PageType.funnel,
          },
        },
      },
      {
        path: `${ROUTES_URLS.okmsId}/${ROUTES_URLS.credentials}/${ROUTES_URLS.createCredential}`,
        ...lazyRouteConfig(() =>
          import('@/pages/credential/create/CreateCredential.page'),
        ),
        handle: {
          tracking: {
            pageName: 'create_access_certificate',
            pageType: PageType.funnel,
          },
        },
        children: [
          {
            path: ROUTES_URLS.createCredentialAddUserModal,
            ...lazyRouteConfig(() =>
              import(
                '@/pages/credential/create/addUsers/CreateCredentialIdentityUserList.page'
              ),
            ),
          },
          {
            path: ROUTES_URLS.createCredentialAddGroupsModal,
            ...lazyRouteConfig(() =>
              import(
                '@/pages/credential/create/addGroups/CreateCredentialIdentityGroupList.page'
              ),
            ),
          },
          {
            path: ROUTES_URLS.createCredentialAddServiceAccountModal,
            ...lazyRouteConfig(() =>
              import(
                '@/pages/credential/create/addServiceAccount/CreateCredentialIdentityServiceAccountList.page'
              ),
            ),
          },
        ],
      },
      {
        path: `${ROUTES_URLS.okmsId}/${ROUTES_URLS.credentials}/${ROUTES_URLS.credentialId}`,
        ...lazyRouteConfig(() => import('@/pages/credential/Credential.page')),
        children: [
          {
            path: '',
            ...lazyRouteConfig(() =>
              import(
                '@/pages/credential/generalInformations/generalInformations.page'
              ),
            ),
            handle: {
              tracking: {
                pageName: 'details_access_certificate',
                pageType: PageType.dashboard,
              },
            },
            children: [
              {
                path: ROUTES_URLS.credentialDelete,
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/credential/generalInformations/delete/DeleteCredentialModal.page'
                  ),
                ),
                handle: {
                  tracking: {
                    pageName: 'delete_access_certificate',
                    pageType: PageType.popup,
                  },
                },
              },
            ],
          },
          {
            path: ROUTES_URLS.credentialIdentities,
            ...lazyRouteConfig(() =>
              import('@/pages/credential/identities/identities.page'),
            ),
            handle: {
              tracking: {
                pageName: 'details_identities',
                pageType: PageType.dashboard,
              },
            },
          },
        ],
      },
      {
        path: `${ROUTES_URLS.okmsId}/${ROUTES_URLS.keys}/${ROUTES_URLS.keyId}`,
        ...lazyRouteConfig(() => import('@/pages/serviceKey/ServiceKey.page')),
        handle: {
          tracking: {
            pageName: 'details_encryption_key',
            pageType: PageType.dashboard,
          },
        },
        children: [
          {
            path: ROUTES_URLS.serviceKeyEditName,
            ...lazyRouteConfig(() =>
              import(
                '@/pages/serviceKey/editServiceKeyNameModal/EditServiceKeyNameModal.page'
              ),
            ),
            handle: {
              tracking: {
                pageName: 'rename_encryption_key',
                pageType: PageType.popup,
              },
            },
          },
          {
            path: ROUTES_URLS.serviceKeyDeactivate,
            ...lazyRouteConfig(() =>
              import(
                '@/pages/serviceKey/deactivateServiceKeyModal/DeactivateServiceKeyModal.page'
              ),
            ),
            handle: {
              tracking: {
                pageName: 'deactivate_encryption_key',
                pageType: PageType.popup,
              },
            },
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
