import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { serviceKeyMock1 } from '@key-management-service/mocks/service-keys/serviceKeys.mock';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { TIMEOUT, assertTextVisibility } from '@/common/utils/tests/uiTestHelpers';
import { assertModalVisibility } from '@/common/utils/tests/uiTestHelpers';

import { SERVICE_KEY_TEST_IDS } from './ServiceKeyDashboard.constants';

const mockPageUrl = KMS_ROUTES_URLS.serviceKeyDashboard(okmsRoubaix1Mock.id, serviceKeyMock1.id);

describe('Service Key dashboard test suite', () => {
  it('should display an error if the API is KO', async () => {
    await renderTestApp(mockPageUrl, {
      isServiceKeyKO: true,
    });

    await waitFor(() => expect(screen.getByAltText('OOPS')).toBeInTheDocument(), {
      timeout: TIMEOUT.MEDIUM,
    });
  });

  it('should display the kms dashboard page', async () => {
    await renderTestApp(mockPageUrl);

    await waitFor(
      () =>
        expect(
          screen.getAllByText(
            labels.serviceKeys['key_management_service_service-keys_dashboard_tab_informations'],
            { exact: false },
          ).length,
        ).toBeGreaterThan(0),

      { timeout: TIMEOUT.MEDIUM },
    );

    expect(screen.queryByAltText('OOPS')).not.toBeInTheDocument();
  });

  it('should open the edit dialog, modify the name, and confirm the changes', async () => {
    const user = userEvent.setup();
    await renderTestApp(mockPageUrl);

    // Open the edit name modal
    const editNameButton = await screen.findByTestId(SERVICE_KEY_TEST_IDS.editNameButton);
    await waitFor(() => expect(editNameButton).toBeEnabled(), {
      timeout: TIMEOUT.MEDIUM,
    });
    await act(() => user.click(editNameButton));
    await assertModalVisibility();

    // Change the name of the service key
    const inputEditServiceKeyName = screen.getByLabelText('input-edit-service-key-name');
    await act(async () => {
      await user.clear(inputEditServiceKeyName);
      await user.type(inputEditServiceKeyName, 'New Service Key Name');
    });

    // Validate the changes
    const validateButton = screen.getByTestId(SERVICE_KEY_TEST_IDS.modifyNameButton);
    await waitFor(() => expect(validateButton).toBeEnabled());
    await act(() => user.click(validateButton));

    // Check for success message
    await assertModalVisibility({ state: 'hidden' });
    await assertTextVisibility(
      labels.serviceKeys['key_management_service_service-keys_update_name_success'],
    );
  });
});
