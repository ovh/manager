import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { useUpdateSecretVersion } from '@secret-manager/data/hooks/useUpdateSecretVersion';
import { SecretVersion } from '@secret-manager/types/secret.type';
import {
  versionActiveMock,
  versionDeactivatedMock,
  versionDeletedMock,
} from '@secret-manager/mocks/versions/versions.mock';
import {
  getOdsButtonByLabel,
  getOdsButtonByIcon,
} from '@/utils/tests/uiTestHelpers';
import { VersionCellAction } from './VersionCellAction.component';
import {
  createErrorResponseMock,
  renderWithClient,
} from '@/utils/tests/testUtils';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-components', async () => {
  const original = await vi.importActual('@ovh-ux/manager-react-components');
  return {
    ...original,
    useNotifications: vi.fn(),
  };
});

vi.mock('@secret-manager/data/hooks/useUpdateSecretVersion', () => ({
  useUpdateSecretVersion: vi.fn(),
}));

vi.mock('@secret-manager/routes/routes.constants', () => ({
  SECRET_MANAGER_ROUTES_URLS: {
    secretVersionsModalDeleteVersion: vi.fn(),
  },
}));

// Test data
const mockOkmsId = 'test-okms-id';
const mockSecretPath = 'test/secret/path';

const renderAndOpenMenu = async (versionMock: SecretVersion) => {
  const user = userEvent.setup();

  const component = VersionCellAction(
    mockOkmsId,
    mockSecretPath,
    versionMock,
    '', // We do not test iam permissions
  );

  const { container } = renderWithClient(component);

  const actionButton = await getOdsButtonByIcon({
    container,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    iconName: 'ellipsis-vertical',
  });

  await act(() => user.click(actionButton));

  return { container, user };
};

describe('VersionCellAction test suite', () => {
  const mockNavigate = vi.fn();
  const mockAddError = vi.fn();
  const mockUpdateSecretVersion = vi.fn();
  const mockT = vi.fn((key: string) => key);

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useNotifications).mockReturnValue({
      addError: mockAddError,
    });
    vi.mocked(useTranslation).mockReturnValue({ t: mockT } as any);
    vi.mocked(useUpdateSecretVersion).mockReturnValue({
      mutateAsync: mockUpdateSecretVersion,
      isPending: false,
    } as any);
  });

  describe('Rendering', () => {
    it.each([
      {
        versionState: 'ACTIVE',
        versionMock: versionActiveMock,
        buttons: [
          {
            label: 'version_state_deactivate',
            shouldBeDisabled: false,
          },
          {
            label: 'version_state_delete',
            shouldBeDisabled: true,
          },
        ],
      },
      {
        versionState: 'DEACTIVATED',
        versionMock: versionDeactivatedMock,
        buttons: [
          {
            label: 'version_state_reactivate',
            shouldBeDisabled: false,
          },
          {
            label: 'version_state_delete',
            shouldBeDisabled: false,
          },
        ],
      },
      {
        versionState: 'DELETED',
        versionMock: versionDeletedMock,
        buttons: [
          {
            label: 'version_state_reactivate',
            shouldBeDisabled: true,
          },
          {
            label: 'version_state_delete',
            shouldBeDisabled: true,
          },
        ],
      },
    ])(
      'should render correct menu items for $versionState version',
      async ({ versionMock, buttons }) => {
        const { container } = await renderAndOpenMenu(versionMock);

        await Promise.all(
          buttons.map(async (buttonConfig) => {
            const button = await getOdsButtonByLabel({
              container,
              label: buttonConfig.label,
              disabled: buttonConfig.shouldBeDisabled,
            });
            expect(button).toBeInTheDocument();

            if (buttonConfig.shouldBeDisabled) {
              expect(button).toBeDisabled();
            } else {
              expect(button).not.toBeDisabled();
            }
          }),
        );
      },
    );
  });

  describe('User Interactions', () => {
    it('should call updateSecretVersion with DEACTIVATED state when deactivate button is clicked', async () => {
      const { container, user } = await renderAndOpenMenu(versionActiveMock);

      const deactivateButton = await getOdsButtonByLabel({
        container,
        label: 'version_state_deactivate',
      });

      user.click(deactivateButton);

      waitFor(() =>
        expect(mockUpdateSecretVersion).toHaveBeenCalledWith({
          okmsId: mockOkmsId,
          path: mockSecretPath,
          version: versionActiveMock.id,
          state: 'DEACTIVATED',
        }),
      );
    });

    it('should call updateSecretVersion with ACTIVE state when activate button is clicked', async () => {
      const { container, user } = await renderAndOpenMenu(
        versionDeactivatedMock,
      );

      const reactivateButton = await getOdsButtonByLabel({
        container,
        label: 'version_state_reactivate',
      });

      user.click(reactivateButton);

      waitFor(() =>
        expect(mockUpdateSecretVersion).toHaveBeenCalledWith({
          okmsId: mockOkmsId,
          path: mockSecretPath,
          version: versionActiveMock.id,
          state: 'ACTIVE',
        }),
      );
    });

    it('should navigate to delete modal when delete button is clicked', async () => {
      const { container, user } = await renderAndOpenMenu(
        versionDeactivatedMock,
      );

      const deleteButton = await getOdsButtonByLabel({
        container,
        label: 'version_state_delete',
      });

      user.click(deleteButton);

      const modalUrl = SECRET_MANAGER_ROUTES_URLS.secretVersionsModalDeleteVersion(
        mockOkmsId,
        mockSecretPath,
        versionDeactivatedMock.id,
      );

      waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(modalUrl);
      });
    });
  });

  describe('Error Handling', () => {
    it('should call addError when updateSecretVersion fails', async () => {
      const errorMessage = createErrorResponseMock('Update Failed');

      mockUpdateSecretVersion.mockRejectedValueOnce(errorMessage);

      const { container, user } = await renderAndOpenMenu(versionActiveMock);

      const deactivateButton = await getOdsButtonByLabel({
        container,
        label: 'version_state_deactivate',
      });

      user.click(deactivateButton);

      await waitFor(() => {
        expect(mockAddError).toHaveBeenCalledWith('Update Failed');
      });
    });
  });
});
