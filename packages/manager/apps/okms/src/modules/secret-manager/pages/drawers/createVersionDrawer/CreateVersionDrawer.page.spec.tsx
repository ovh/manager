import React from 'react';
import { vi } from 'vitest';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MOCK_DATA_VALID_JSON } from '@secret-manager/utils/tests/secret.constants';
import { SECRET_FORM_FIELD_TEST_IDS } from '@secret-manager/components/form/form.constants';
import {
  assertTextVisibility,
  getOdsButtonByLabel,
  WAIT_FOR_DEFAULT_OPTIONS,
} from '@ovh-ux/manager-core-test-utils';
import * as secretVersionsApi from '@secret-manager/data/api/secretVersions';
import { getSecretMockWithData } from '@secret-manager/mocks/secrets/secretsMock.utils';
import { okmsRoubaix1Mock } from '@/mocks/kms/okms.mock';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';
import { changeOdsInputValueByTestId } from '@/utils/tests/uiTestHelpers';
import { CREATE_VERSION_DRAWER_TEST_IDS } from './CreateVersionDrawer.constants';

const mockOkmsId = okmsRoubaix1Mock.id;
const mockedSecret = mockSecret1;
const mockPageUrl = SECRET_MANAGER_ROUTES_URLS.versionListCreateVersionDrawer(
  mockOkmsId,
  mockedSecret.path,
);

// Mocking ODS Input component
vi.mock('@ovhcloud/ods-components/react', async () => {
  const original = await vi.importActual('@ovhcloud/ods-components/react');
  return {
    ...original,
    OdsTextarea: vi.fn(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ className, onOdsChange, onOdsBlur, isResizable, ...rest }) => (
        <textarea
          data-testid={rest['data-testid']}
          className={className}
          onChange={(e) => onOdsChange && onOdsChange(e.target.value)}
          onBlur={() => onOdsBlur && onOdsBlur()}
          {...rest}
        />
      ),
    ),
  };
});

const renderPage = async ({ url = mockPageUrl }: { url?: string } = {}) => {
  const user = userEvent.setup();
  const { container } = await renderTestApp(url);

  // Check if the drawer is open
  expect(
    await screen.findByTestId(
      CREATE_VERSION_DRAWER_TEST_IDS.drawer,
      {},
      WAIT_FOR_DEFAULT_OPTIONS,
    ),
  ).toBeInTheDocument();

  // wait for the content to be displayed
  await assertTextVisibility(labels.secretManager.add_new_version);
  await assertTextVisibility(labels.secretManager.editor);

  return { user, container };
};

describe('Secret create version drawer page test suite', () => {
  it('should display the create version drawer', async () => {
    const { container } = await renderPage();

    // Check disabled sumbit button
    await getOdsButtonByLabel({
      container,
      label: labels.common.actions.add,
      disabled: true,
    });
  });

  it('should display the current secret value', async () => {
    await renderPage();

    const dataInput = screen.getByTestId(SECRET_FORM_FIELD_TEST_IDS.INPUT_DATA);

    // Check if the data input contains the secret value
    expect(dataInput).toBeInTheDocument();
    expect(dataInput).toHaveValue(
      JSON.stringify(getSecretMockWithData(mockedSecret).version.data),
    );
  });

  it('should add cas to the createSecretVersion request and close the drawer after submission', async () => {
    const { container, user } = await renderPage();
    vi.spyOn(secretVersionsApi, 'createSecretVersion').mockResolvedValue(
      getSecretMockWithData(mockedSecret).version,
    );

    // Change the data input value
    await changeOdsInputValueByTestId(
      SECRET_FORM_FIELD_TEST_IDS.INPUT_DATA,
      MOCK_DATA_VALID_JSON,
    );

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
        data: JSON.parse(MOCK_DATA_VALID_JSON),
        cas: mockedSecret.metadata.currentVersion,
      });
    });

    // Wait for the drawer to close
    await waitFor(() => {
      expect(
        screen.queryByTestId(CREATE_VERSION_DRAWER_TEST_IDS.drawer),
      ).not.toBeInTheDocument();
    });
  });
});
