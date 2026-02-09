import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { SECRET_FORM_FIELD_TEST_IDS } from '@secret-manager/components/form/form.constants';
import {
  getSecretConfigErrorMessage,
  updateSecretConfigErrorMessage,
} from '@secret-manager/mocks/secret-config-okms/secretConfigOkms.handler';
import { mockSecretConfigOkms } from '@secret-manager/mocks/secret-config-okms/secretConfigOkms.mock';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import {
  TIMEOUT,
  assertDrawerVisibility,
  changeInputValueByTestId,
} from '@/common/utils/tests/uiTestHelpers';

const mockOkmsId = okmsRoubaix1Mock.id;
const mockPageUrl = SECRET_MANAGER_ROUTES_URLS.okmsUpdateSecretConfigDrawer(mockOkmsId);

// We mock @ovh-ux/manager-billing-informations module because it takes 3 secondes to load
// And make the test suite slow
vi.mock('@ovh-ux/manager-billing-informations', () => ({
  BillingInformationsTileStandard: vi.fn(() => <div>BillingInformationsTileStandard</div>),
}));

const renderPage = async (mockParams = {}) => {
  const user = userEvent.setup();
  const { container } = await renderTestApp(mockPageUrl, mockParams);

  // Check if the drawer is open
  await assertDrawerVisibility({ state: 'visible', timeout: TIMEOUT.MEDIUM });

  return { user, container };
};

describe('okms edit secret config drawer page test suite', () => {
  it('should display the edit okms secret config drawer', async () => {
    // GIVEN

    // WHEN
    await renderPage();

    // THEN
    await waitFor(() => {
      expect(screen.getByText(labels.secretManager.edit_okms_secret_config)).toBeInTheDocument();
    });
  });

  it('should display error message when okms secret config fetch fails', async () => {
    // GIVEN isSecretConfigKO

    // WHEN
    await renderPage({ isSecretConfigKO: true });

    // THEN
    await waitFor(() => {
      expect(screen.getByText(getSecretConfigErrorMessage)).toBeInTheDocument();
    });

    expect(
      screen.queryByTestId(SECRET_FORM_FIELD_TEST_IDS.DEACTIVATE_VERSION_AFTER),
    ).not.toBeInTheDocument();
  });

  it('should render form with correct data when everything loads successfully', async () => {
    await renderPage();

    // Wait for form to be rendered
    const maxVersions = mockSecretConfigOkms.maxVersions.toString();
    expect(await screen.findByDisplayValue(maxVersions)).toBeInTheDocument();

    // Check form fields are populated with secret data
    expect(
      screen.getByDisplayValue(mockSecretConfigOkms.deactivateVersionAfter),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue(maxVersions)).toBeInTheDocument();

    // Check submit button is present
    const submitButton = screen.getByRole('button', {
      name: labels.common.actions.validate,
    });
    expect(submitButton).toBeInTheDocument();
  });

  it('should handle form submission and navigation flow', async () => {
    // GIVEN
    const { user } = await renderPage();

    // WHEN
    // Change the data input value
    await changeInputValueByTestId(
      SECRET_FORM_FIELD_TEST_IDS.DEACTIVATE_VERSION_AFTER,
      '99d99h99m99s',
    );

    // Submit form
    const submitButton = screen.getByRole('button', {
      name: labels.common.actions.validate,
    });
    await act(async () => {
      await user.click(submitButton);
    });

    // THEN
    // Wait for drawer to close (navigation)
    await assertDrawerVisibility({ state: 'hidden' });
  });

  it('should handle form submission errors', async () => {
    // GIVEN isUpdateSecretConfigKO
    const { user } = await renderPage({
      isUpdateSecretConfigKO: true,
    });

    // Wait for form to load
    const maxVersions = mockSecretConfigOkms.maxVersions.toString();
    expect(await screen.findByDisplayValue(maxVersions)).toBeInTheDocument();

    // WHEN
    // Submit form
    const submitButton = screen.getByRole('button', {
      name: labels.common.actions.validate,
    });
    await act(async () => {
      await user.click(submitButton);
    });

    // THEN
    // Verify error is displayed
    expect(await screen.findByText(updateSecretConfigErrorMessage)).toBeInTheDocument();

    // Drawer should still be open
    await assertDrawerVisibility({ state: 'visible' });
  });
});
