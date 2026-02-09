import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { KEY_VALUES_EDITOR_TEST_IDS } from '@secret-manager/components/form/key-values-editor/keyValuesEditor.constants';
import { mockSecret1, mockSecret3 } from '@secret-manager/mocks/secrets/secrets.mock';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { Secret } from '@secret-manager/types/secret.type';
import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { labels } from '@/common/utils/tests/init.i18n';
import { RenderTestMockParams, renderTestApp } from '@/common/utils/tests/renderTestApp';
import {
  assertDrawerVisibility,
  changeInputValueByTestId,
} from '@/common/utils/tests/uiTestHelpers';

const mockOkmsId = okmsRoubaix1Mock.id;

const renderPage = async (mockSecret: Secret, mockParams: RenderTestMockParams = {}) => {
  const mockPageUrl = SECRET_MANAGER_ROUTES_URLS.secretEditCustomMetadataDrawer(
    mockOkmsId,
    mockSecret.path,
  );
  const user = userEvent.setup();
  await renderTestApp(mockPageUrl, mockParams);

  const drawer = await assertDrawerVisibility({ state: 'visible' });

  return { user, drawer };
};

describe('Edit Custom Metadata Drawer page test suite', () => {
  it('should display the edit custom metadata drawer', async () => {
    const { drawer } = await renderPage(mockSecret1);

    await waitFor(() => {
      expect(
        within(drawer).getByText(labels.secretManager.edit_custom_metadata),
      ).toBeInTheDocument();
    });
  });

  it('should display the add custom metadata title if the secret has no custom metadata', async () => {
    const { drawer } = await renderPage(mockSecret3);

    await waitFor(() => {
      expect(
        within(drawer).getByText(labels.secretManager.add_custom_metadata),
      ).toBeInTheDocument();
    });
  });

  it('should render form with correct data when everything loads successfully', async () => {
    await renderPage(mockSecret1);

    // Wait for form to be rendered - check that KeyValuesEditor is present with the custom metadata
    expect(
      await screen.findByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(0)),
    ).toBeInTheDocument();

    // Check that the key-value pairs are rendered
    const environmentKeyInput = screen.getByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(0));
    const applicationKeyInput = screen.getByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(1));

    expect(environmentKeyInput).toBeInTheDocument();
    expect(applicationKeyInput).toBeInTheDocument();

    // Check submit button is present
    const submitButton = screen.getByRole('button', {
      name: labels.common.actions.validate,
    });
    expect(submitButton).toBeInTheDocument();
  });

  it('should handle form submission and navigation flow', async () => {
    const { user } = await renderPage(mockSecret1);

    // Wait for form to load
    expect(
      await screen.findByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(0)),
    ).toBeInTheDocument();

    // Change a value in the KeyValuesEditor
    await changeInputValueByTestId(
      KEY_VALUES_EDITOR_TEST_IDS.pairItemValueInput(0),
      'updated-value',
    );

    // Submit form
    const submitButton = screen.getByRole('button', {
      name: labels.common.actions.validate,
    });
    await act(() => user.click(submitButton));

    // Wait for drawer to close (navigation)
    await assertDrawerVisibility({ state: 'hidden' });
  });

  it('should handle form submission errors', async () => {
    const { user } = await renderPage(mockSecret1, { isUpdateSecretKO: true });

    // Wait for form to load
    expect(
      await screen.findByTestId(KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(0)),
    ).toBeInTheDocument();

    // Submit form
    const submitButton = screen.getByRole('button', {
      name: labels.common.actions.validate,
    });
    await act(() => user.click(submitButton));

    // Verify error is displayed
    expect(await screen.findByText('update-secret-error-message')).toBeInTheDocument();

    // Drawer should still be open
    await assertDrawerVisibility({ state: 'visible' });
  });
});
