import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { SECRET_FORM_FIELD_TEST_IDS } from '@secret-manager/components/form/form.constants';
import * as secretVersionsApi from '@secret-manager/data/api/secretVersions';
import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { getSecretMockWithData } from '@secret-manager/mocks/secrets/secretsMock.utils';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import {
  TIMEOUT,
  assertDrawerVisibility,
  clickJsonEditorToggle,
} from '@/common/utils/tests/uiTestHelpers';
import { invariant } from '@/common/utils/tools/invariant';

const mockOkmsId = okmsRoubaix1Mock.id;
const mockedSecret = mockSecret1;
const mockPageUrl = SECRET_MANAGER_ROUTES_URLS.versionListCreateVersionDrawer(
  mockOkmsId,
  mockedSecret.path,
  1,
);

/**
 * Renders the create version drawer page
 */
const renderPage = async ({ url = mockPageUrl }: { url?: string } = {}) => {
  const user = userEvent.setup();
  await renderTestApp(url);

  // Check if the drawer is open (use MEDIUM timeout for lazy-loaded route)
  const drawer = await assertDrawerVisibility({ state: 'visible', timeout: TIMEOUT.MEDIUM });

  // Wait for the title to appear (drawer content to load)
  await waitFor(() => {
    expect(within(drawer).getByText(labels.secretManager.add_new_version)).toBeInTheDocument();
  });

  // switch label
  await waitFor(() => {
    expect(within(drawer).getByText(labels.secretManager.key_value)).toBeInTheDocument();
  });

  return { user };
};

describe('Secret create version drawer page test suite', () => {
  it('should display the create version drawer', async () => {
    await renderPage();

    // Check disabled sumbit button
    const button = screen.getByRole('button', {
      name: labels.common.actions.add,
    });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('should display the current secret value', async () => {
    const { user } = await renderPage();

    // Click on the JSON toggle to switch to the JSON editor
    await clickJsonEditorToggle(user);

    // Check if the data input contains the secret value (Monaco editor formats JSON with 2 spaces)
    const dataInput = screen.getByTestId(SECRET_FORM_FIELD_TEST_IDS.INPUT_DATA);
    expect(dataInput).toBeInTheDocument();
    const expectedData = getSecretMockWithData(mockedSecret).version?.data;
    expect(JSON.parse((dataInput as HTMLTextAreaElement).value || '{}')).toEqual(expectedData);
  });

  it('should display no value if the url does not specify a default version id', async () => {
    const { user } = await renderPage({
      url: SECRET_MANAGER_ROUTES_URLS.versionListCreateVersionDrawer(mockOkmsId, mockedSecret.path),
    });

    // Click on the JSON toggle to switch to the JSON editor
    await clickJsonEditorToggle(user);

    // Check if the data input is empty
    const dataInput = screen.getByTestId(SECRET_FORM_FIELD_TEST_IDS.INPUT_DATA);
    expect(dataInput).toBeInTheDocument();
    expect(dataInput).toHaveValue('');
  });

  it('should add cas to the createSecretVersion request and close the drawer after submission', async () => {
    const { user } = await renderPage();

    // Mock the createSecretVersion request
    const version = getSecretMockWithData(mockedSecret).version;
    invariant(version, 'Version is required');
    vi.spyOn(secretVersionsApi, 'createSecretVersion').mockResolvedValue(version);

    // Click on the JSON toggle to switch to the JSON editor
    await clickJsonEditorToggle(user);

    const MOCK_NEW_DATA = '{"key1":"value1","key2":"value2"}';
    // Change the data input value
    const input = await screen.findByTestId(SECRET_FORM_FIELD_TEST_IDS.INPUT_DATA);

    // clean first the input
    await act(() => user.clear(input));
    // then type the new value
    const escaped = MOCK_NEW_DATA.replace(/{/g, '{{');
    await act(() => user.type(input, escaped));

    // Submit the form
    // Button should be enabled after input change
    await waitFor(() => {
      const submitButton = screen.getByRole('button', {
        name: labels.common.actions.add,
      });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toBeEnabled();
    });

    const submitButton = screen.getByRole('button', {
      name: labels.common.actions.add,
    });
    await act(() => user.click(submitButton));

    // Wait for the createSecretVersion to be called
    await waitFor(() => {
      expect(secretVersionsApi.createSecretVersion).toHaveBeenCalledWith({
        okmsId: mockOkmsId,
        path: mockedSecret.path,
        data: JSON.parse(MOCK_NEW_DATA) as Record<string, unknown>,
        cas: mockedSecret.metadata.currentVersion,
      });
    });

    // Wait for the drawer to close
    await assertDrawerVisibility({ state: 'hidden', timeout: TIMEOUT.MEDIUM });
  });
});
