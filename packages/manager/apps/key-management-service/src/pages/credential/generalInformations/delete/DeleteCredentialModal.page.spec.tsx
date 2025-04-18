import { vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  getOdsButtonByLabel,
  changeOdsInputValue,
  assertOdsModalVisibility,
  WAIT_FOR_DEFAULT_OPTIONS,
} from '@ovh-ux/manager-core-test-utils';
import * as router from 'react-router-dom';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { okmsMock } from '@/mocks/kms/okms.mock';
import { credentialMock } from '@/mocks/credentials/credentials.mock';
import { labels } from '@/utils/tests/init.i18n';

const mockCredentialItem = credentialMock[0];
const mockPageUrl = `/${okmsMock[0].id}/credentials/${mockCredentialItem.id}/delete`;
const mockCredentialListPageUrl = `/${okmsMock[0].id}/credentials`;

const deleteModalTitleLabel =
  labels.credentials.key_management_service_credential_delete_modal_headline;

describe('Credential delete modal test suite', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    mockNavigate.mockReset();
    vi.spyOn(router, 'useNavigate').mockImplementation(() => mockNavigate);
  });

  test('should display the delete modal', async () => {
    const { container } = await renderTestApp(mockPageUrl);

    // Check modal is opened
    await waitFor(() => {
      assertOdsModalVisibility({ container, isVisible: true });
      expect(screen.getByText(deleteModalTitleLabel)).toBeVisible();
    }, WAIT_FOR_DEFAULT_OPTIONS);
  });

  test('should navigate and show a notification after successful deletion', async () => {
    const user = userEvent.setup();
    const { container } = await renderTestApp(mockPageUrl);

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByText(deleteModalTitleLabel)).toBeVisible();
    }, WAIT_FOR_DEFAULT_OPTIONS);

    await changeOdsInputValue({
      inputLabel:
        labels.credentials
          .key_management_service_credential_delete_modal_input_label,
      inputValue: 'TERMINATE',
    });

    const submitButton = await getOdsButtonByLabel({
      container,
      label: 'Résilier', // Label from MRC
      disabled: false,
    });

    user.click(submitButton);

    // Check navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(mockCredentialListPageUrl, {
        state: { deletingCredentialId: mockCredentialItem.id },
      });
    }, WAIT_FOR_DEFAULT_OPTIONS);

    // Check notification
    await waitFor(() => {
      expect(
        screen.getByText(
          labels.credentials.key_management_service_credential_delete_success,
        ),
      ).toBeVisible();
    });
  });

  test('should navigate and show a notification after failed deletion', async () => {
    const user = userEvent.setup();
    const { container } = await renderTestApp(mockPageUrl, {
      isCredentialDeleteKO: true,
    });

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByText(deleteModalTitleLabel)).toBeVisible();
    }, WAIT_FOR_DEFAULT_OPTIONS);

    await changeOdsInputValue({
      inputLabel:
        labels.credentials
          .key_management_service_credential_delete_modal_input_label,
      inputValue: 'TERMINATE',
    });

    const submitButton = await getOdsButtonByLabel({
      container,
      label: 'Résilier', // Label from MRC
      timeout: WAIT_FOR_DEFAULT_OPTIONS.timeout,
      disabled: false,
    });

    user.click(submitButton);

    // Check navigation
    await waitFor(
      () => expect(mockNavigate).toHaveBeenCalledWith('..'),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    // Check notification
    await waitFor(() => {
      const notificationLabel = labels.credentials.key_management_service_credential_delete_error.replace(
        ' {{error}}',
        '',
      );
      expect(
        screen.getByText((content) => content.includes(notificationLabel)),
      ).toBeVisible();
    });
  });
});
