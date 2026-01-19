import { getOkms } from '@key-management-service/data/api/okms';
import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { OKMS } from '@key-management-service/types/okms.type';
import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import {
  versionActiveMock,
  versionDeactivatedMock,
  versionDeletedMock,
} from '@secret-manager/mocks/versions/versions.mock';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { SecretVersion } from '@secret-manager/types/secret.type';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { ODS_BUTTON_COLOR } from '@ovhcloud/ods-components';

import { ActionMenuItem } from '@ovh-ux/manager-react-components';

import { kmsIamActions } from '@/common/utils/iam/iam.constants';
import { labels } from '@/common/utils/tests/init.i18n';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { UseDeleteVersionParams, useDeleteVersionItem } from './useDeleteVersionMenuItem';

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

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/common/hooks/useOkmsTracking', () => ({
  useOkmsTracking: () => ({
    trackClick: vi.fn(),
  }),
}));

const deleteMenuItem: ActionMenuItem = {
  id: MOCKED_ID,
  label: labels.secretManager.version_state_delete,
  isDisabled: false,
  isLoading: false,
  urn: MOCKED_SECRET.iam.urn,
  iamActions: [kmsIamActions.secretVersionUpdate, kmsIamActions.secretVersionDelete],
};

const renderTestHook = async (values: UseDeleteVersionParams) => {
  const wrapper = await testWrapperBuilder().withI18next().withQueryClient().build();

  return renderHook(() => useDeleteVersionItem(values), { wrapper });
};

describe('useDeleteVersionMenuItem test suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  type TestCase = {
    version: SecretVersion;
    returned: ActionMenuItem | null;
  };

  const disabledDeleteMenuItem: ActionMenuItem = {
    id: MOCKED_ID,
    label: labels.secretManager.version_state_delete,
    isDisabled: true,
    color: ODS_BUTTON_COLOR.critical,
  };

  const testCases: TestCase[] = [
    {
      version: versionActiveMock,
      returned: disabledDeleteMenuItem,
    },
    { version: versionDeactivatedMock, returned: deleteMenuItem },
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
      ...deleteMenuItem,
      isDisabled: true,
    });
  });

  it('should call navigate and when onClick is called', async () => {
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
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining(
        SECRET_MANAGER_ROUTES_URLS.versionListDeleteVersionModal(
          OKMS_OK_MOCK.id,
          MOCKED_SECRET.path,
          versionDeactivatedMock.id,
        ),
      ),
    );
  });
});
