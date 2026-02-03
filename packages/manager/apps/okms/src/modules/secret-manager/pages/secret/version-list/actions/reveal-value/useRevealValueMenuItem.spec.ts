import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
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

import { ActionMenuItem } from '@ovh-ux/manager-react-components';

import { kmsIamActions } from '@/common/utils/iam/iam.constants';
import { labels } from '@/common/utils/tests/init.i18n';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { UseRevealValueParams, useRevealValueMenuItem } from './useRevealValueMenuItem';

const OKMS_OK_MOCK = okmsRoubaix1Mock;
const MOCKED_SECRET = mockSecret1;
const MOCKED_ID = 0;

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

const revealSecretMenuItem: ActionMenuItem = {
  id: MOCKED_ID,
  label: labels.secretManager.reveal_secret,
  urn: MOCKED_SECRET.iam.urn,
  iamActions: [kmsIamActions.secretGet, kmsIamActions.secretVersionGetData],
};

const renderTestHook = async (values: UseRevealValueParams) => {
  const wrapper = await testWrapperBuilder().withI18next().build();

  return renderHook(() => useRevealValueMenuItem(values), { wrapper });
};

describe('useActivateVersionMenuItem test suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  type TestCase = {
    version: SecretVersion;
    returned: ActionMenuItem | null;
  };

  const disabledRevealSecretMenuItem: ActionMenuItem = {
    id: MOCKED_ID,
    label: labels.secretManager.reveal_secret,
    isDisabled: true,
  };

  const testCases: TestCase[] = [
    { version: versionActiveMock, returned: revealSecretMenuItem },
    { version: versionDeactivatedMock, returned: disabledRevealSecretMenuItem },
    { version: versionDeletedMock, returned: null },
  ];

  it.each(testCases)(
    'should return $returned when secret version state is $version.state',
    async ({ returned, version }) => {
      // GIVEN

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

  it('should call navigate and when onClick is called', async () => {
    // GIVEN
    const { result } = await renderTestHook({
      id: 0,
      okmsId: OKMS_OK_MOCK.id,
      secret: MOCKED_SECRET,
      version: versionActiveMock,
    });
    await waitFor(() => result.current);

    // WHEN
    if (result.current) {
      result.current.onClick?.();
    }

    // THEN
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining(
        SECRET_MANAGER_ROUTES_URLS.versionListSecretValueDrawer(
          OKMS_OK_MOCK.id,
          MOCKED_SECRET.path,
          versionActiveMock.id,
        ),
      ),
    );
  });
});
