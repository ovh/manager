import { getOkms } from '@key-management-service/data/api/okms';
import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { OKMS } from '@key-management-service/types/okms.type';
import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import {
  versionActiveMock,
  versionDeactivatedMock,
  versionDeletedMock,
} from '@secret-manager/mocks/versions/versions.mock';
import { SecretVersion } from '@secret-manager/types/secret.type';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { ApiError } from '@ovh-ux/manager-core-api';
import { ActionMenuItem } from '@ovh-ux/manager-react-components';

import { kmsIamActions } from '@/common/utils/iam/iam.constants';
import { labels } from '@/common/utils/tests/init.i18n';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { UseActivateVersionParams, useActivateVersionItem } from './useActivateVersionMenuItem';

const OKMS_OK_MOCK = okmsRoubaix1Mock;
const OKMS_EXPIRED_MOCK: OKMS = {
  ...okmsRoubaix1Mock,
  iam: { ...okmsRoubaix1Mock.iam, state: 'EXPIRED' },
};
const MOCKED_SECRET = mockSecret1;
const MOCKED_ID = 0;

vi.mock('@key-management-service/data/api/okms', async () => {
  const actual = await vi.importActual('@key-management-service/data/api/okms');
  return {
    ...actual,
    getOkms: vi.fn(),
  };
});
const mockGetOkms = vi.mocked(getOkms);

const mockUpdateSecretVersion = vi.fn();
vi.mock('@secret-manager/data/hooks/useUpdateSecretVersion', () => ({
  useUpdateSecretVersion: () => ({
    mutateAsync: mockUpdateSecretVersion,
    isPending: false, // Default value
  }),
}));

const mockAddError = vi.fn();
vi.mock('@ovh-ux/manager-react-components', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-react-components');
  return {
    ...actual,
    useNotifications: () => ({
      addError: mockAddError,
    }),
  };
});

const activateMenuItem: ActionMenuItem = {
  id: MOCKED_ID,
  label: labels.secretManager.version_state_reactivate,
  isDisabled: false,
  isLoading: false,
  urn: MOCKED_SECRET.iam.urn,
  iamActions: [kmsIamActions.secretVersionUpdate, kmsIamActions.secretVersionActivate],
};

const renderTestHook = async (values: UseActivateVersionParams) => {
  const wrapper = await testWrapperBuilder().withI18next().withQueryClient().build();

  return renderHook(() => useActivateVersionItem(values), { wrapper });
};

describe('useActivateVersionMenuItem test suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  type TestCase = {
    version: SecretVersion;
    returned: ActionMenuItem | null;
  };

  const testCases: TestCase[] = [
    { version: versionActiveMock, returned: null },
    { version: versionDeactivatedMock, returned: activateMenuItem },
    { version: versionDeletedMock, returned: null },
  ];

  it.each(testCases)(
    'should return $returned when secret version state is $version.state',
    async ({ returned, version }) => {
      // GIVEN
      mockGetOkms.mockResolvedValue(OKMS_OK_MOCK);

      // WHEN
      const { result } = await renderTestHook({
        id: 0,
        okmsId: OKMS_OK_MOCK.id,
        secret: MOCKED_SECRET,
        version,
      });
      await waitFor(() => result.current);

      // THEN
      if (returned === null) expect(result.current).toBeNull();
      else expect(result.current).toMatchObject<ActionMenuItem>(returned);
    },
  );

  it('should return a disabled item when okms is not ok', async () => {
    // GIVEN
    mockGetOkms.mockResolvedValue(OKMS_EXPIRED_MOCK);

    // WHEN
    const { result } = await renderTestHook({
      id: 0,
      okmsId: OKMS_OK_MOCK.id,
      secret: MOCKED_SECRET,
      version: versionDeactivatedMock,
    });
    await waitFor(() => result.current);

    // THEN
    expect(result.current).toMatchObject<ActionMenuItem>({
      ...activateMenuItem,
      isDisabled: true,
    });
  });

  it('should call updateSecretVersion with correct parameters when onClick is triggered', async () => {
    // GIVEN
    mockGetOkms.mockResolvedValue(OKMS_OK_MOCK);
    const { result } = await renderTestHook({
      id: 0,
      okmsId: OKMS_OK_MOCK.id,
      secret: MOCKED_SECRET,
      version: versionDeactivatedMock,
    });
    await waitFor(() => result.current);

    // WHEN
    if (result.current) {
      result.current.onClick?.();
    }

    // THEN
    expect(mockUpdateSecretVersion).toHaveBeenCalledWith({
      okmsId: OKMS_OK_MOCK.id,
      path: MOCKED_SECRET.path,
      version: versionDeactivatedMock.id,
      state: 'ACTIVE',
    });
  });

  it('should handle error when updateSecretVersion fails', async () => {
    // GIVEN
    mockGetOkms.mockResolvedValue(OKMS_OK_MOCK);
    const errorMessage = 'Failed to update secret version';
    const apiError = {
      response: {
        data: {
          message: errorMessage,
        },
      },
    } as ApiError;

    mockUpdateSecretVersion.mockRejectedValue(apiError); // Mock rejection with error

    const { result } = await renderTestHook({
      id: 0,
      okmsId: OKMS_OK_MOCK.id,
      secret: MOCKED_SECRET,
      version: versionDeactivatedMock,
    });
    await waitFor(() => result.current);

    // WHEN
    if (result.current) {
      result.current.onClick?.();
    }

    // THEN
    await waitFor(() => {
      expect(mockAddError).toHaveBeenCalledWith(errorMessage);
    });
  });
});
