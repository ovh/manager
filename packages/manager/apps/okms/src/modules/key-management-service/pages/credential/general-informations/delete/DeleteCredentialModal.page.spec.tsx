import * as router from 'react-router-dom';

import { credentialMock1 } from '@key-management-service/mocks/credentials/credentials.mock';
import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import {
  WAIT_FOR_DEFAULT_OPTIONS,
  assertOdsModalVisibility,
  getOdsButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';

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
    const { container } = await renderTestApp(mockPageUrl);

    // Check modal is opened
    await waitFor(async () => {
      await assertOdsModalVisibility({ container, isVisible: true });
    }, WAIT_FOR_DEFAULT_OPTIONS);
  });

  test('should navigate and show a notification after successful deletion', async () => {
    const user = userEvent.setup();
    const { container } = await renderTestApp(mockPageUrl);

    // Wait for modal to open
    await waitFor(async () => {
      await assertOdsModalVisibility({ container, isVisible: true });
    }, WAIT_FOR_DEFAULT_OPTIONS);

    // TODO: [ODS19] Remove this getOdsButtonByLabel after BaseLayout migration
    const submitButton = await getOdsButtonByLabel({
      container,
      label: 'Oui, résilier', // Label from MRC
      disabled: false,
    });

    await user.click(submitButton);

    // Check navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(mockCredentialListPageUrl, {
        state: { deletingCredentialId: mockCredentialItem.id },
      });
    }, WAIT_FOR_DEFAULT_OPTIONS);

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
    const { container } = await renderTestApp(mockPageUrl, {
      isCredentialDeleteKO: true,
    });

    // Wait for modal to open
    await waitFor(async () => {
      await assertOdsModalVisibility({ container, isVisible: true });
    }, WAIT_FOR_DEFAULT_OPTIONS);

    // TODO: [ODS19] Remove this getOdsButtonByLabel after BaseLayout migration
    const submitButton = await getOdsButtonByLabel({
      container,
      label: 'Oui, résilier', // Label from MRC
      timeout: WAIT_FOR_DEFAULT_OPTIONS.timeout,
      disabled: false,
    });

    await user.click(submitButton);

    // Check navigation
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('..'), WAIT_FOR_DEFAULT_OPTIONS);

    // Check notification
    await waitFor(() => {
      const notificationLabel =
        labels.credentials.key_management_service_credential_delete_error.replace(' {{error}}', '');
      expect(screen.getByText((content) => content.includes(notificationLabel))).toBeVisible();
    });
  });
});
