import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { logsRoutes } from '@ovh-ux/logs-to-customer';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import NotFound from '../pages/404';
import {
  KMS_ROUTES_URIS,
  KMS_ROUTES_URLS,
  SMS_ROUTES_URIS,
} from './routes.constants';

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

const KMS_ROUTES: RouteObject = {
  path: KMS_ROUTES_URIS.root,
  children: [
    {
      path: '',
      ...lazyRouteConfig(() => import('@/pages/listing')),
      handle: {
        tracking: {
          pageName: '',
          pageType: PageType.listing,
        },
      },
      children: [
        {
          path: `${KMS_ROUTES_URIS.terminateOkms}/${KMS_ROUTES_URIS.okmsId}`,
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
      path: KMS_ROUTES_URIS.createKeyManagementService,
      ...lazyRouteConfig(() => import('@/pages/create')),
      handle: {
        tracking: {
          pageName: 'create_kms',
          pageType: PageType.funnel,
        },
      },
    },
    {
      path: KMS_ROUTES_URIS.onboarding,
      ...lazyRouteConfig(() => import('@/pages/onboarding')),
      handle: {
        tracking: {
          pageName: 'onboarding',
          pageType: PageType.onboarding,
        },
      },
    },
    {
      path: KMS_ROUTES_URIS.okmsId,
      ...lazyRouteConfig(() => import('@/pages/dashboard')),
      children: [
        {
          path: '',
          ...lazyRouteConfig(() =>
            import('@/pages/dashboard/generalInformations/GeneralInformations'),
          ),
          handle: {
            tracking: {
              pageName: 'general_informations',
              pageType: PageType.dashboard,
            },
          },
          children: [
            {
              path: KMS_ROUTES_URIS.okmsUpdateName,
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
              path: KMS_ROUTES_URIS.terminateOkms,
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
          path: KMS_ROUTES_URIS.keys,
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
              path: `${KMS_ROUTES_URIS.serviceKeyDeactivate}/${KMS_ROUTES_URIS.keyId}`,
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
          path: KMS_ROUTES_URIS.credentials,
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
              path: `${KMS_ROUTES_URIS.credentialDelete}/${KMS_ROUTES_URIS.credentialId}`,
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
          path: `${KMS_ROUTES_URIS.logs}/*`,
          ...lazyRouteConfig(() => import('@/pages/dashboard/logs/Logs.page')),
          children: [...logsRoutes],
        },
      ],
    },
    {
      path: `${KMS_ROUTES_URIS.okmsId}/${KMS_ROUTES_URIS.keys}/${KMS_ROUTES_URIS.createKmsServiceKey}`,
      ...lazyRouteConfig(() => import('@/pages/serviceKey/CreateKey.page')),
      handle: {
        tracking: {
          pageName: 'create_encryption_key',
          pageType: PageType.funnel,
        },
      },
    },
    {
      path: `${KMS_ROUTES_URIS.okmsId}/${KMS_ROUTES_URIS.credentials}/${KMS_ROUTES_URIS.createCredential}`,
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
          path: KMS_ROUTES_URIS.createCredentialAddUserModal,
          ...lazyRouteConfig(() =>
            import(
              '@/pages/credential/create/addUsers/CreateCredentialIdentityUserList.page'
            ),
          ),
        },
        {
          path: KMS_ROUTES_URIS.createCredentialAddGroupsModal,
          ...lazyRouteConfig(() =>
            import(
              '@/pages/credential/create/addGroups/CreateCredentialIdentityGroupList.page'
            ),
          ),
        },
        {
          path: KMS_ROUTES_URIS.createCredentialAddServiceAccountModal,
          ...lazyRouteConfig(() =>
            import(
              '@/pages/credential/create/addServiceAccount/CreateCredentialIdentityServiceAccountList.page'
            ),
          ),
        },
      ],
    },
    {
      path: `${KMS_ROUTES_URIS.okmsId}/${KMS_ROUTES_URIS.credentials}/${KMS_ROUTES_URIS.credentialId}`,
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
              path: KMS_ROUTES_URIS.credentialDelete,
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
          path: KMS_ROUTES_URIS.credentialIdentities,
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
      path: `${KMS_ROUTES_URIS.okmsId}/${KMS_ROUTES_URIS.keys}/${KMS_ROUTES_URIS.keyId}`,
      ...lazyRouteConfig(() => import('@/pages/serviceKey/ServiceKey.page')),
      handle: {
        tracking: {
          pageName: 'details_encryption_key',
          pageType: PageType.dashboard,
        },
      },
      children: [
        {
          path: KMS_ROUTES_URIS.serviceKeyEditName,
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
          path: KMS_ROUTES_URIS.serviceKeyDeactivate,
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
};

const SMS_ROUTES: RouteObject = {
  path: SMS_ROUTES_URIS.root,
  ...lazyRouteConfig(() => import('@secrets/pages/domain/dashboard.page')),
};

const routes: RouteObject[] = [
  {
    path: '',
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        path: '',
        element: <Navigate to={KMS_ROUTES_URLS.kmsListing} replace />,
      },
      KMS_ROUTES,
      SMS_ROUTES,
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
