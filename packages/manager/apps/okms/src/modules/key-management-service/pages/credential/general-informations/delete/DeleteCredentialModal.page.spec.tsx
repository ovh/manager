import * as router from 'react-router-dom';

import { credentialMock1 } from '@key-management-service/mocks/credentials/credentials.mock';
import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { TIMEOUT, assertModalVisibility } from '@/common/utils/tests/uiTestHelpers';

const mockOkms = okmsRoubaix1Mock;
const mockCredentialItem = credentialMock1;
const mockPageUrl = KMS_ROUTES_URLS.credentialDashboardDelete(mockOkms.id, mockCredentialItem.id);
const mockCredentialListPageUrl = KMS_ROUTES_URLS.credentialListing(mockOkms.id);

describe('Credential delete modal test suite', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    mockNavigate.mockReset();
    vi.spyOn(router, 'useNavigate').mockImplementation(() => mockNavigate);
  });

  test('should display the delete modal', async () => {
    await renderTestApp(mockPageUrl);

    // Check modal is opened
    await assertModalVisibility();
  });

  test('should navigate and show a notification after successful deletion', async () => {
    const user = userEvent.setup();
    await renderTestApp(mockPageUrl);

    // Wait for modal to open
    const modal = await assertModalVisibility();

    const submitButton = within(modal).getByRole('button', {
      name: labels.common.actions.delete,
    });

    await act(async () => {
      await user.click(submitButton);
    });

    // Check navigation
    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith(mockCredentialListPageUrl, {
          state: { deletingCredentialId: mockCredentialItem.id },
        });
      },
      { timeout: TIMEOUT.DEFAULT },
    );

    // Check notification
    await waitFor(
      () => {
        expect(
          screen.getByText(labels.credentials.key_management_service_credential_delete_success),
        ).toBeVisible();
      },
      { timeout: 5000 },
    );
  });

  test('should navigate and show a notification after failed deletion', async () => {
    const user = userEvent.setup();
    await renderTestApp(mockPageUrl, {
      isCredentialDeleteKO: true,
    });

    // Wait for modal to open
    const modal = await assertModalVisibility();

    let submitButton = within(modal).getByRole('button', {
      name: labels.common.actions.delete,
    });

    await act(async () => {
      await user.click(submitButton);
    });

    // Check notification
    await waitFor(() => {
      const notificationLabel =
        labels.credentials.key_management_service_credential_delete_error.replace(' {{error}}', '');
      expect(screen.getByText((content) => content.includes(notificationLabel))).toBeVisible();
    });
  });
});
