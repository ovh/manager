import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { getOdsButtonByLabel } from '@ovh-ux/manager-core-test-utils';
import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { SECRET_FORM_FIELD_TEST_IDS } from '@secret-manager/components/form/form.constants';
import { okmsRoubaix1Mock } from '@/mocks/kms/okms.mock';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';
import { changeOdsInputValueByTestId } from '@/utils/tests/uiTestHelpers';

const mockOkmsId = okmsRoubaix1Mock.id;
const mockSecret = mockSecret1;
const mockSecretPath = mockSecret.path;
const mockPageUrl = SECRET_MANAGER_ROUTES_URLS.secretEditMetadataDrawer(
  mockOkmsId,
  mockSecretPath,
);

const renderPage = async (mockParams = {}) => {
  const user = userEvent.setup();
  const { container } = await renderTestApp(mockPageUrl, mockParams);

  // Check if the drawer is open
  expect(await screen.findByTestId('edit-metadata-drawer')).toBeInTheDocument();

  return { user, container };
};

describe('Edit Metadata Drawer page test suite', () => {
  it('should display the edit metadata drawer', async () => {
    await renderPage();

    // Should show the drawer title
    expect(
      screen.getByText(labels.secretManager.edit_metadata),
    ).toBeInTheDocument();
  });

  it('should display error message when secret smart config fetch fails', async () => {
    await renderPage({ isSecretConfigKO: true });

    // Should display and error message
    await waitFor(() => {
      expect(
        screen.getAllByText('get-secret-config-error-message')[0],
      ).toBeInTheDocument();
    });

    // Should NOT display the form when there's an error
    expect(
      screen.queryByTestId(SECRET_FORM_FIELD_TEST_IDS.DEACTIVATE_VERSION_AFTER),
    ).not.toBeInTheDocument();
  });

  it('should render form with correct data when everything loads successfully', async () => {
    const { container } = await renderPage();

    // Wait for form to be rendered
    const maxVersions = mockSecret.metadata.maxVersions.toString();
    expect(await screen.findByDisplayValue(maxVersions)).toBeInTheDocument();

    // Check form fields are populated with secret data
    expect(
      screen.getByDisplayValue(mockSecret.metadata.deactivateVersionAfter),
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
    const { user, container } = await renderPage();

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

    // Wait for drawer to close (navigation)
    await waitFor(() => {
      expect(
        screen.queryByTestId('edit-metadata-drawer'),
      ).not.toBeInTheDocument();
    });
  });

  it('should handle form submission errors', async () => {
    const { user, container } = await renderPage({ isUpdateSecretKO: true });

    // Wait for form to load
    const maxVersions = mockSecret.metadata.maxVersions.toString();
    expect(await screen.findByDisplayValue(maxVersions)).toBeInTheDocument();

    // Submit form
    const submitButton = await getOdsButtonByLabel({
      container,
      label: labels.common.actions.validate,
    });
    await act(() => user.click(submitButton));

    // Verify error is displayed
    expect(
      await screen.findByText('update-secret-error-message'),
    ).toBeInTheDocument();

    // Drawer should still be open
    expect(screen.getByTestId('edit-metadata-drawer')).toBeInTheDocument();
  });
});
