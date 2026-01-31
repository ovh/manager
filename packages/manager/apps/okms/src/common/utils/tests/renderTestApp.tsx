import {
  CreateCredentialsMockParams,
  DeleteCredentialsMockParams,
  GetCredentialsMockParams,
  createCredentialsMock,
  deleteCredentialMock,
  getCredentialsMock,
} from '@key-management-service/mocks/credentials/credentials.handler';
import {
  GetFeatureAvailabilityMocksParams,
  getFeatureAvailabilityMocks,
} from '@key-management-service/mocks/feature-availability/feature-availability.handler';
import {
  GetIamAuthorizationMockParams,
  getIamMocks,
} from '@key-management-service/mocks/iam/iam.handler';
import { getIdentityUserIds } from '@key-management-service/mocks/identity/identityUserIds.handler';
import { getIdentityUsers } from '@key-management-service/mocks/identity/identityUsers.handler';
import { GetOkmsMocksParams, getOkmsMocks } from '@key-management-service/mocks/kms/okms.handler';
import {
  GetReferenceMockParams,
  getReferenceMock,
} from '@key-management-service/mocks/reference/reference.handler';
import {
  GetServiceKeysMockParams,
  getServiceKeysMock,
} from '@key-management-service/mocks/service-keys/serviceKeys.handler';
import { kmsServicesMock } from '@key-management-service/mocks/services/services.mock';
import {
  GetSecretConfigOkmsMockParams,
  UpdateSecretConfigOkmsMockParams,
  getSecretConfigOkmsMock,
  updateSecretConfigOkmsMock,
} from '@secret-manager/mocks/secret-config-okms/secretConfigOkms.handler';
import {
  GetSecretConfigReferenceMockParams,
  getSecretConfigReferenceMock,
} from '@secret-manager/mocks/secret-reference/secretReference.handler';
import {
  CreateSecretsMockParams,
  DeleteSecretMockParams,
  GetSecretMockParams,
  GetSecretsMockParams,
  UpdateSecretMockParams,
  createSecretsMock,
  deleteSecretMock,
  getSecretMock,
  getSecretsMock,
  updateSecretMock,
} from '@secret-manager/mocks/secrets/secrets.handler';
import {
  CreateVersionMockParams,
  GetVersionMockParams,
  GetVersionsMockParams,
  UpdateVersionMockParams,
  createVersionMock,
  getVersionMock,
  getVersionsMock,
  updateVersionMock,
} from '@secret-manager/mocks/versions/versions.handler';
import { render } from '@testing-library/react';

import { getAuthenticationMocks, toMswHandlers } from '@ovh-ux/manager-core-test-utils';
import { GetServicesMocksParams, getServicesMocks } from '@ovh-ux/manager-module-common-api';

import {
  GetCatalogKmsMocksParams,
  getCatalogKmsMocks,
} from '@/common/mocks/catalog/catalog.handler';
import { getLocationsMock } from '@/common/mocks/locations/locations.handler';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { TestApp } from './TestApp';
import { removeHandlersDelay } from './msw';

export type RenderTestMockParams = GetOkmsMocksParams &
  GetServiceKeysMockParams &
  GetCredentialsMockParams &
  GetServicesMocksParams &
  GetFeatureAvailabilityMocksParams &
  GetCatalogKmsMocksParams &
  GetReferenceMockParams &
  GetIamAuthorizationMockParams &
  DeleteCredentialsMockParams &
  CreateCredentialsMockParams &
  GetSecretsMockParams &
  GetSecretMockParams &
  CreateSecretsMockParams &
  UpdateSecretMockParams &
  DeleteSecretMockParams &
  GetSecretConfigOkmsMockParams &
  UpdateSecretConfigOkmsMockParams &
  GetSecretConfigReferenceMockParams &
  GetVersionsMockParams &
  GetVersionMockParams &
  CreateVersionMockParams &
  UpdateVersionMockParams;

export const renderTestApp = async (initialRoute = '/', mockParams: RenderTestMockParams = {}) => {
  global.server?.resetHandlers(
    ...toMswHandlers(
      removeHandlersDelay([
        ...getAuthenticationMocks({ isAuthMocked: true }),
        ...getOkmsMocks(mockParams),
        ...getServiceKeysMock(mockParams),
        ...getServicesMocks({
          ...mockParams,
          serviceResponse: kmsServicesMock,
        }),
        ...getIamMocks(mockParams),
        ...getCredentialsMock(mockParams),
        ...getFeatureAvailabilityMocks(mockParams),
        ...getCatalogKmsMocks(mockParams),
        ...getReferenceMock(mockParams),
        ...createCredentialsMock(mockParams),
        ...deleteCredentialMock(mockParams),
        ...getIdentityUserIds(),
        ...getIdentityUsers(),
        ...getLocationsMock(),
        ...getSecretsMock(mockParams),
        ...getSecretMock(mockParams),
        ...createSecretsMock(mockParams),
        ...updateSecretMock(mockParams),
        ...deleteSecretMock(mockParams),
        ...getSecretConfigOkmsMock(mockParams),
        ...updateSecretConfigOkmsMock(mockParams),
        ...getSecretConfigReferenceMock(mockParams),
        ...getVersionsMock(mockParams),
        ...getVersionMock(mockParams),
        ...createVersionMock(mockParams),
        ...updateVersionMock(mockParams),
      ]),
    ),
  );

  const wrapper = await testWrapperBuilder()
    .withQueryClient()
    .withI18next()
    .withShellContext()
    .build();

  return render(<TestApp initialRoute={initialRoute} />, { wrapper });
};
