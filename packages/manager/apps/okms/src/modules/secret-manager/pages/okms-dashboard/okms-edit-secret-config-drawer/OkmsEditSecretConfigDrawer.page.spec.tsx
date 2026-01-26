import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { SECRET_FORM_FIELD_TEST_IDS } from '@secret-manager/components/form/form.constants';
import {
  getSecretConfigErrorMessage,
  updateSecretConfigErrorMessage,
} from '@secret-manager/mocks/secret-config-okms/secretConfigOkms.handler';
import { mockSecretConfigOkms } from '@secret-manager/mocks/secret-config-okms/secretConfigOkms.mock';
import { getSecretConfigReferenceErrorMessage } from '@secret-manager/mocks/secret-reference/secretReference.handler';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { getOdsButtonByLabel } from '@ovh-ux/manager-core-test-utils';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { changeOdsInputValueByTestId } from '@/common/utils/tests/uiTestHelpers';

import { OKMS_EDIT_SECRET_CONFIG_DRAWER_TEST_IDS } from './OkmsEditSecretConfigDrawer.page.constants';

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

  // First, wait for the parent dashboard page to load (page-spinner to disappear)
  await waitFor(
    () => {
      expect(screen.queryByTestId('page-spinner')).not.toBeInTheDocument();
    },
    { timeout: 10_000 },
  );

  // Then check if the drawer is open
  await waitFor(
    async () => {
      expect(
        await screen.findByTestId(OKMS_EDIT_SECRET_CONFIG_DRAWER_TEST_IDS.drawer),
      ).toBeInTheDocument();
    },
    { timeout: 10_000 },
  );

  // Wait for drawer loading to complete
  await waitFor(
    () => {
      const spinners = container.querySelectorAll('ods-spinner');
      expect(spinners.length).toBe(0);
    },
    { timeout: 10_000 },
  );

  return { user, container };
};

describe('okms edit secret config drawer page test suite', () => {
  it('should display the edit okms secret config drawer', async () => {
    // GIVEN

    // WHEN
    await renderPage();

    // THEN
    expect(screen.getByText(labels.secretManager.edit_okms_secret_config)).toBeInTheDocument();
  });

  it('should display error message when secret config reference fetch fails', async () => {
    // GIVEN isSecretConfigReferenceKO

    // WHEN
    await renderPage({ isSecretConfigReferenceKO: true });

    // THEN
    await waitFor(() => {
      expect(screen.getByText(getSecretConfigReferenceErrorMessage)).toBeInTheDocument();
    });

    expect(
      screen.queryByTestId(SECRET_FORM_FIELD_TEST_IDS.DEACTIVATE_VERSION_AFTER),
    ).not.toBeInTheDocument();
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
    const { container } = await renderPage();

    // Wait for form to be rendered
    const maxVersions = mockSecretConfigOkms.maxVersions.toString();
    expect(await screen.findByDisplayValue(maxVersions)).toBeInTheDocument();

    // Check form fields are populated with secret data
    expect(
      screen.getByDisplayValue(mockSecretConfigOkms.deactivateVersionAfter),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue(maxVersions)).toBeInTheDocument();

    // Check submit button is present
    const submitButton = await getOdsButtonByLabel({
      container,
      label: labels.common.actions.validate,
    });
    expect(submitButton).toBeInTheDocument();
  });

  it('should handle form submission and navigation flow', async () => {
    // GIVEN
    const { user, container } = await renderPage();

    // WHEN
    // Change the data input value
    await changeOdsInputValueByTestId(
      SECRET_FORM_FIELD_TEST_IDS.DEACTIVATE_VERSION_AFTER,
      '99d99h99m99s',
    );

    // Submit form
    const submitButton = await getOdsButtonByLabel({
      container,
      label: labels.common.actions.validate,
    });
    await act(() => user.click(submitButton));

    // THEN
    // Wait for drawer to close (navigation)
    await waitFor(() => {
      expect(
        screen.queryByTestId(OKMS_EDIT_SECRET_CONFIG_DRAWER_TEST_IDS.drawer),
      ).not.toBeInTheDocument();
    });
  });

  it('should handle form submission errors', async () => {
    // GIVEN isUpdateSecretConfigKO
    const { user, container } = await renderPage({
      isUpdateSecretConfigKO: true,
    });

    // Wait for form to load
    const maxVersions = mockSecretConfigOkms.maxVersions.toString();
    expect(await screen.findByDisplayValue(maxVersions)).toBeInTheDocument();

    // WHEN
    // Submit form
    const submitButton = await getOdsButtonByLabel({
      container,
      label: labels.common.actions.validate,
    });
    await act(() => user.click(submitButton));

    // THEN
    // Verify error is displayed
    expect(await screen.findByText(updateSecretConfigErrorMessage)).toBeInTheDocument();

    // Drawer should still be open
    expect(screen.getByTestId(OKMS_EDIT_SECRET_CONFIG_DRAWER_TEST_IDS.drawer)).toBeInTheDocument();
  });
});
