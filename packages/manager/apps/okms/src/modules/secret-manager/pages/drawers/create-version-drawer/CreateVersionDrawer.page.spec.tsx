import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { SECRET_FORM_FIELD_TEST_IDS } from '@secret-manager/components/form/form.constants';
import * as secretVersionsApi from '@secret-manager/data/api/secretVersions';
import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { getSecretMockWithData } from '@secret-manager/mocks/secrets/secretsMock.utils';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import {
  WAIT_FOR_DEFAULT_OPTIONS,
  assertTextVisibility,
  getOdsButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { clickJsonEditorToggle } from '@/common/utils/tests/uiTestHelpers';
import { invariant } from '@/common/utils/tools/invariant';

import { CREATE_VERSION_DRAWER_TEST_IDS } from './CreateVersionDrawer.constants';

const mockOkmsId = okmsRoubaix1Mock.id;
const mockedSecret = mockSecret1;
const mockPageUrl = SECRET_MANAGER_ROUTES_URLS.versionListCreateVersionDrawer(
  mockOkmsId,
  mockedSecret.path,
  1,
);

// Mocking ODS components
vi.mock('@ovhcloud/ods-components/react', async () => {
  const { odsInputMock, odsTextareaMock, odsSwitchMock, odsSwitchItemMock } = await import(
    '@/common/utils/tests/odsMocks'
  );
  const original = await vi.importActual('@ovhcloud/ods-components/react');
  return {
    ...original,
    OdsInput: vi.fn(odsInputMock),
    OdsTextarea: vi.fn(odsTextareaMock),
    OdsSwitch: vi.fn(odsSwitchMock),
    OdsSwitchItem: vi.fn(odsSwitchItemMock),
  };
});

/**
 * Renders the create version drawer page
 */
const renderPage = async ({ url = mockPageUrl }: { url?: string } = {}) => {
  const user = userEvent.setup();
  const { container } = await renderTestApp(url);

  // Check if the drawer is open
  expect(
    await screen.findByTestId(CREATE_VERSION_DRAWER_TEST_IDS.drawer, {}, WAIT_FOR_DEFAULT_OPTIONS),
  ).toBeInTheDocument();

  // wait for the content to be displayed
  await assertTextVisibility(labels.secretManager.add_new_version);
  await assertTextVisibility(labels.secretManager.key_value);

  return { user, container };
};

describe('Secret create version drawer page test suite', () => {
  it('should display the create version drawer', async () => {
    const { container } = await renderPage();

    // Check disabled sumbit button
    const button = await getOdsButtonByLabel({
      container,
      label: labels.common.actions.add,
      disabled: true,
    });
    expect(button).toBeInTheDocument();
  });

  it('should display the current secret value', async () => {
    const { user } = await renderPage();

    // Click on the JSON toggle to switch to the JSON editor
    await clickJsonEditorToggle(user);

    // Check if the data input contains the secret value
    const dataInput = screen.getByTestId(SECRET_FORM_FIELD_TEST_IDS.INPUT_DATA);
    expect(dataInput).toBeInTheDocument();
    expect(dataInput).toHaveValue(
      JSON.stringify(getSecretMockWithData(mockedSecret).version?.data),
    );
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
    const { container, user } = await renderPage();

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
    const submitButton = await getOdsButtonByLabel({
      container,
      label: labels.common.actions.add,
    });
    expect(submitButton).toBeInTheDocument();

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
    await waitFor(() => {
      expect(screen.queryByTestId(CREATE_VERSION_DRAWER_TEST_IDS.drawer)).not.toBeInTheDocument();
    });
  });
});
