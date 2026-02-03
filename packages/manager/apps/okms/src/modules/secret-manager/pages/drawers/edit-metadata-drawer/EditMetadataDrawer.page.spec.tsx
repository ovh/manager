import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { SECRET_FORM_FIELD_TEST_IDS } from '@secret-manager/components/form/form.constants';
import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { getOdsButtonByLabel } from '@ovh-ux/manager-core-test-utils';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { changeOdsInputValueByTestId } from '@/common/utils/tests/uiTestHelpers';

const mockOkmsId = okmsRoubaix1Mock.id;
const mockSecret = mockSecret1;
const mockSecretPath = mockSecret.path;
const mockPageUrl = SECRET_MANAGER_ROUTES_URLS.secretEditMetadataDrawer(mockOkmsId, mockSecretPath);

const renderPage = async (mockParams = {}) => {
  const user = userEvent.setup();
  const { container } = await renderTestApp(mockPageUrl, mockParams);

  // Check if the drawer is open
  await waitFor(
    async () => {
      expect(await screen.findByTestId('edit-metadata-drawer')).toBeInTheDocument();
    },
    { timeout: 10_000 },
  );

  // Wait for drawer loading to complete (spinner inside drawer and progressbar)
  await waitFor(
    () => {
      const spinners = container.querySelectorAll('ods-spinner');
      expect(spinners.length).toBe(0);
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    },
    { timeout: 10_000 },
  );

  return { user, container };
};

describe('Edit Metadata Drawer page test suite', () => {
  it('should display the edit metadata drawer', async () => {
    await renderPage();

    // Should show the drawer title
    expect(screen.getByText(labels.secretManager.edit_metadata)).toBeInTheDocument();
  });

  it('should display error message when secret smart config fetch fails', async () => {
    await renderPage({ isSecretConfigKO: true });

    // Should display and error message
    await waitFor(() => {
      expect(screen.getAllByText('get-secret-config-error-message')[0]).toBeInTheDocument();
    });

    // Should NOT display the form when there's an error
    expect(
      screen.queryByTestId(SECRET_FORM_FIELD_TEST_IDS.DEACTIVATE_VERSION_AFTER),
    ).not.toBeInTheDocument();
  });

  it('should render form with correct data when everything loads successfully', async () => {
    const { container } = await renderPage();

    // Wait for form fields to be rendered - wait for the deactivate version after field
    await waitFor(
      () => {
        expect(
          screen.getByTestId(SECRET_FORM_FIELD_TEST_IDS.DEACTIVATE_VERSION_AFTER),
        ).toBeInTheDocument();
      },
      { timeout: 10_000 },
    );

    // Wait for form to be rendered with correct values
    const maxVersions = mockSecret.metadata.maxVersions.toString();
    await waitFor(
      () => {
        expect(screen.getByDisplayValue(maxVersions)).toBeInTheDocument();
      },
      { timeout: 10_000 },
    );

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

    // Wait for form field to be ready
    await waitFor(
      () => {
        expect(
          screen.getByTestId(SECRET_FORM_FIELD_TEST_IDS.DEACTIVATE_VERSION_AFTER),
        ).toBeInTheDocument();
      },
      { timeout: 10_000 },
    );

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
    await waitFor(
      () => {
        expect(screen.queryByTestId('edit-metadata-drawer')).not.toBeInTheDocument();
      },
      { timeout: 10_000 },
    );
  });

  it('should handle form submission errors', async () => {
    const { user, container } = await renderPage({ isUpdateSecretKO: true });

    // Wait for form field to be ready
    await waitFor(
      () => {
        expect(
          screen.getByTestId(SECRET_FORM_FIELD_TEST_IDS.DEACTIVATE_VERSION_AFTER),
        ).toBeInTheDocument();
      },
      { timeout: 10_000 },
    );

    // Wait for form to load with correct values
    const maxVersions = mockSecret.metadata.maxVersions.toString();
    await waitFor(
      () => {
        expect(screen.getByDisplayValue(maxVersions)).toBeInTheDocument();
      },
      { timeout: 10_000 },
    );

    // Submit form
    const submitButton = await getOdsButtonByLabel({
      container,
      label: labels.common.actions.validate,
    });
    await act(() => user.click(submitButton));

    // Verify error is displayed
    await waitFor(
      () => {
        expect(screen.getByText('update-secret-error-message')).toBeInTheDocument();
      },
      { timeout: 10_000 },
    );

    // Drawer should still be open
    expect(screen.getByTestId('edit-metadata-drawer')).toBeInTheDocument();
  });
});
