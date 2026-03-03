import { credentialMock1 } from '@key-management-service/mocks/credentials/credentials.mock';
import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { TIMEOUT } from '@/common/utils/tests/uiTestHelpers';
import { assertModalVisibility } from '@/common/utils/tests/uiTestHelpers';

const mockOkms = okmsRoubaix1Mock;
const mockCredentialItem = credentialMock1;
const mockPageUrl = KMS_ROUTES_URLS.credentialDashboard(mockOkms.id, mockCredentialItem.id);

describe('Credential general informations test suite', () => {
  test('should display the credentials details', async () => {
    const { container } = await renderTestApp(mockPageUrl);

    const titleLabel =
      labels.credentials.key_management_service_credential_dashboard_tile_general_informations;

    await waitFor(
      () => {
        expect(screen.getByText(titleLabel)).toBeVisible();
        expect(screen.getAllByText(mockCredentialItem.name)[0]).toBeVisible();
        if (mockCredentialItem.description) {
          expect(screen.getAllByText(mockCredentialItem.description)[0]).toBeVisible();
        }

        const clipboardElement = container.querySelector(`[value="${mockCredentialItem.id}"]`);
        expect(clipboardElement).toBeVisible();
      },
      { timeout: TIMEOUT.MEDIUM },
    );
  });

  test('should navigate to the delete modal on click on delete button', async () => {
    const user = userEvent.setup();
    await renderTestApp(mockPageUrl);

    const deleteButtonLabel = labels.credentials.key_management_service_credential_delete;

    // Check modal is closed
    await assertModalVisibility({ state: 'hidden' });

    // Wait for the delete button to be enabled by iam rights
    await waitFor(
      () => {
        expect(
          screen.getByRole('button', {
            name: deleteButtonLabel,
          }),
        ).toBeEnabled();
      },
      { timeout: TIMEOUT.MEDIUM },
    );

    // Click button
    const deleteButton = screen.getByRole('button', {
      name: deleteButtonLabel,
    });

    await act(async () => {
      await user.click(deleteButton);
    });

    // Check modal is opened
    await assertModalVisibility({ state: 'visible' });
  });
});
