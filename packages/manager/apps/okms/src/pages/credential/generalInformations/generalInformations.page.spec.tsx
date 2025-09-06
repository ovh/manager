import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  getOdsButtonByLabel,
  assertOdsModalVisibility,
  WAIT_FOR_DEFAULT_OPTIONS,
} from '@ovh-ux/manager-core-test-utils';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { okmsMock } from '@/mocks/kms/okms.mock';
import { credentialMock } from '@/mocks/credentials/credentials.mock';
import { labels } from '@/utils/tests/init.i18n';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';

const mockCredentialItem = credentialMock[0];
const mockPageUrl = KMS_ROUTES_URLS.credentialDashboard(
  okmsMock[0].id,
  mockCredentialItem.id,
);

describe('Credential general informations test suite', () => {
  test('should display the credentials details', async () => {
    const { container } = await renderTestApp(mockPageUrl);

    const titleLabel =
      labels.credentials
        .key_management_service_credential_dashboard_tile_general_informations;

    await waitFor(() => {
      expect(screen.getByText(titleLabel)).toBeVisible();
      expect(screen.getAllByText(mockCredentialItem.name)[0]).toBeVisible();
      if (mockCredentialItem.description) {
        expect(
          screen.getAllByText(mockCredentialItem.description)[0],
        ).toBeVisible();
      }

      const clipboardElement = container.querySelector(
        `[value="${mockCredentialItem.id}"]`,
      );
      expect(clipboardElement).toBeVisible();
    }, WAIT_FOR_DEFAULT_OPTIONS);
  });

  test('should navigate to the delete modal on click on delete button', async () => {
    const user = userEvent.setup();
    const { container } = await renderTestApp(mockPageUrl);

    const deleteButtonLabel =
      labels.credentials.key_management_service_credential_delete;

    // Check modal is closed
    await waitFor(async () => {
      assertOdsModalVisibility({ container, isVisible: false });
    }, WAIT_FOR_DEFAULT_OPTIONS);

    // Wait for the delete button to be enabled by iam rights
    await waitFor(async () => {
      await getOdsButtonByLabel({
        container,
        label: deleteButtonLabel,
        disabled: false,
      });
    }, WAIT_FOR_DEFAULT_OPTIONS);

    // Click button
    const deleteButton = await getOdsButtonByLabel({
      container,
      label: deleteButtonLabel,
      disabled: false,
    });
    user.click(deleteButton);

    // Check modal is opened
    await waitFor(() => {
      assertOdsModalVisibility({ container, isVisible: true });
    }, WAIT_FOR_DEFAULT_OPTIONS);
  });
});
