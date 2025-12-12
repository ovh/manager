import { useNavigate } from 'react-router-dom';

import { useUpdateSecretVersion } from '@secret-manager/data/hooks/useUpdateSecretVersion';
import {
  versionActiveMock,
  versionDeactivatedMock,
  versionDeletedMock,
} from '@secret-manager/mocks/versions/versions.mock';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { SecretVersion } from '@secret-manager/types/secret.type';
import { act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useNotifications } from '@ovh-ux/manager-react-components';

import { initTestI18n, labels } from '@/common/utils/tests/init.i18n';
import { createErrorResponseMock, renderWithClient } from '@/common/utils/tests/testUtils';
import { getOdsButtonByIcon, getOdsButtonByLabel } from '@/common/utils/tests/uiTestHelpers';

import { VersionCellAction } from './VersionCellAction.component';

let i18nValue: i18n;

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
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
    versionListDeleteVersionModal: vi.fn(),
  },
}));

vi.mock('@/common/hooks/useOkmsTracking', () => ({
  useOkmsTracking: () => ({ trackClick: vi.fn() }),
}));

// Test data
const mockOkmsId = 'test-okms-id';
const mockSecretPath = 'test/secret/path';

const renderAndOpenMenu = async (versionMock: SecretVersion) => {
  if (!i18nValue) {
    i18nValue = await initTestI18n();
  }

  const user = userEvent.setup();

  const { container } = renderWithClient(
    <I18nextProvider i18n={i18nValue}>
      <VersionCellAction
        okmsId={mockOkmsId}
        secretPath={mockSecretPath}
        version={versionMock}
        urn=""
      />
    </I18nextProvider>,
  );

  const actionButton = await getOdsButtonByIcon({
    container,
    iconName: 'ellipsis-vertical',
  });

  await act(async () => {
    await user.click(actionButton);
  });

  return { container, user };
};

describe('VersionCellAction test suite', () => {
  const mockNavigate = vi.fn();
  const mockAddError = vi.fn();
  const mockUpdateSecretVersion = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useNotifications).mockReturnValue({
      addError: mockAddError,
    });
    vi.mocked(useUpdateSecretVersion).mockReturnValue({
      mutateAsync: mockUpdateSecretVersion,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateSecretVersion>);
  });

  describe('Rendering', () => {
    it.each([
      {
        versionState: 'ACTIVE',
        versionMock: versionActiveMock,
        buttons: [
          {
            label: labels.secretManager.reveal_secret,
            shouldBeDisabled: false,
          },
          {
            label: labels.secretManager.version_state_deactivate,
            shouldBeDisabled: false,
          },
          {
            label: labels.secretManager.version_state_delete,
            shouldBeDisabled: true,
          },
        ],
      },
      {
        versionState: 'DEACTIVATED',
        versionMock: versionDeactivatedMock,
        buttons: [
          {
            label: labels.secretManager.reveal_secret,
            shouldBeDisabled: true,
          },
          {
            label: labels.secretManager.version_state_reactivate,
            shouldBeDisabled: false,
          },
          {
            label: labels.secretManager.version_state_delete,
            shouldBeDisabled: false,
          },
        ],
      },
      {
        versionState: 'DELETED',
        versionMock: versionDeletedMock,
        buttons: [
          {
            label: labels.secretManager.reveal_secret,
            shouldBeDisabled: true,
          },
          {
            label: labels.secretManager.version_state_reactivate,
            shouldBeDisabled: true,
          },
          {
            label: labels.secretManager.version_state_delete,
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
        label: labels.secretManager.version_state_deactivate,
      });

      await user.click(deactivateButton);

      await waitFor(() =>
        expect(mockUpdateSecretVersion).toHaveBeenCalledWith({
          okmsId: mockOkmsId,
          path: mockSecretPath,
          version: versionActiveMock.id,
          state: 'DEACTIVATED',
        }),
      );
    });

    it('should call updateSecretVersion with ACTIVE state when activate button is clicked', async () => {
      const { container, user } = await renderAndOpenMenu(versionDeactivatedMock);

      const reactivateButton = await getOdsButtonByLabel({
        container,
        label: labels.secretManager.version_state_reactivate,
      });

      await user.click(reactivateButton);

      await waitFor(() =>
        expect(mockUpdateSecretVersion).toHaveBeenCalledWith({
          okmsId: mockOkmsId,
          path: mockSecretPath,
          version: versionDeactivatedMock.id,
          state: 'ACTIVE',
        }),
      );
    });

    it('should navigate to delete modal when delete button is clicked', async () => {
      const { container, user } = await renderAndOpenMenu(versionDeactivatedMock);

      const deleteButton = await getOdsButtonByLabel({
        container,
        label: labels.secretManager.version_state_delete,
      });

      await user.click(deleteButton);

      const modalUrl = SECRET_MANAGER_ROUTES_URLS.versionListDeleteVersionModal(
        mockOkmsId,
        mockSecretPath,
        versionDeactivatedMock.id,
      );

      await waitFor(() => {
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
        label: labels.secretManager.version_state_deactivate,
      });

      await user.click(deactivateButton);

      await waitFor(() => {
        expect(mockAddError).toHaveBeenCalledWith('Update Failed');
      });
    });
  });
});
