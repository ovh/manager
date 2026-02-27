import { SERVICE_KEY_LIST_CELL_TEST_IDS } from '@key-management-service/components/listing/ListingCells.constants';
import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { serviceKeyMock1 } from '@key-management-service/mocks/service-keys/serviceKeys.mock';
import { CREATE_KEY_TEST_IDS } from '@key-management-service/pages/service-key/create/CreateKey.constants';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import '@testing-library/jest-dom';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { TIMEOUT, assertTextVisibility } from '@/common/utils/tests/uiTestHelpers';

import { SERVICE_KEY_LIST_TEST_IDS } from './ServiceKeyList.constants';

const mockPageUrl = KMS_ROUTES_URLS.serviceKeyListing(okmsRoubaix1Mock.id);

describe('Service Key list test suite', () => {
  it('should display an error if the API is KO', async () => {
    await renderTestApp(mockPageUrl, { isServiceKeyKO: true });

    await waitFor(() => expect(screen.getByAltText('OOPS')).toBeInTheDocument(), {
      timeout: TIMEOUT.MEDIUM,
    });
  });

  it('should display the kms keys listing page', async () => {
    await renderTestApp(mockPageUrl);

    await assertTextVisibility(labels.serviceKeys['key_management_service_service-keys_headline']);

    expect(screen.queryByAltText('OOPS')).not.toBeInTheDocument();
  });

  it(`should navigate to the service key page creation on click on ${labels.serviceKeys['key_management_service_service-keys_cta_create']} and then create a key `, async () => {
    const user = userEvent.setup();
    await renderTestApp(mockPageUrl);

    await assertTextVisibility(labels.serviceKeys['key_management_service_service-keys_headline']);

    const buttonCreate = screen.getByRole('button', {
      name: labels.serviceKeys['key_management_service_service-keys_cta_create'],
    });

    await waitFor(() => expect(buttonCreate).toBeEnabled());

    await act(() => user.click(screen.getByTestId(SERVICE_KEY_LIST_TEST_IDS.buttonCreateKey)));

    await assertTextVisibility(
      labels.serviceKeys['key_management_service_service-keys_create_subtitle'],
    );

    await assertTextVisibility(
      labels.serviceKeys['key_management_service_service-keys_create_crypto_field_size_title'],
    );

    const keyNameInput = screen.getByPlaceholderText(
      labels.serviceKeys[
        'key_management_service_service-keys_create_general_information_field_name_placeholder'
      ],
    );

    await act(async () => {
      await user.clear(keyNameInput);
      await user.type(keyNameInput, 'New Key');
    });

    await waitFor(() =>
      expect(screen.getByTestId(CREATE_KEY_TEST_IDS.buttonConfirm)).toBeEnabled(),
    );

    await act(() => user.click(screen.getByTestId(CREATE_KEY_TEST_IDS.buttonConfirm)));

    await assertTextVisibility(
      labels.serviceKeys['key_management_service_service-keys_create_success'],
    );
  });

  it('should navigate to the service key dashboard page after clicking on a key from the listing', async () => {
    await renderTestApp(mockPageUrl);

    await assertTextVisibility(labels.serviceKeys['key_management_service_service-keys_headline']);

    await act(() =>
      userEvent.click(screen.getByTestId(SERVICE_KEY_LIST_CELL_TEST_IDS.name(serviceKeyMock1.id))),
    );

    const elements = screen.getAllByText(
      labels.serviceKeys['key_management_service_service-keys_dashboard_tab_informations'],
    );
    expect(elements.length).toBeGreaterThan(0);
  });
});
