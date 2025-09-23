import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { WAIT_FOR_DEFAULT_OPTIONS } from '@ovh-ux/manager-core-test-utils';
import userEvent from '@testing-library/user-event';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import '@testing-library/jest-dom';
import { labels } from '@/utils/tests/init.i18n';
import { okmsMock } from '@/mocks/kms/okms.mock';
import { serviceKeyMock } from '@/mocks/serviceKeys/serviceKeys.mock';
import { CREATE_KEY_TEST_IDS } from '@/pages/serviceKey/create/CreateKey.constants';
import { SERVICE_KEY_LIST_TEST_IDS } from './ServiceKeyList.constants';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';

const mockPageUrl = KMS_ROUTES_URLS.serviceKeyListing(okmsMock[0].id);

describe('Service Key list test suite', () => {
  it('should display an error if the API is KO', async () => {
    await renderTestApp(mockPageUrl, { isServiceKeyKO: true });

    await waitFor(
      () => expect(screen.getByAltText('OOPS')).toBeInTheDocument(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });

  it('should display the kms keys listing page', async () => {
    await renderTestApp(mockPageUrl);

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.serviceKeys['key_management_service_service-keys_headline'],
          ),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    expect(screen.queryByAltText('OOPS')).not.toBeInTheDocument();
  });

  it.skip(`should navigate to the service key page creation on click on ${labels.serviceKeys['key_management_service_service-keys_cta_create']} and then create a key `, async () => {
    const user = userEvent.setup();
    await renderTestApp(mockPageUrl);

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.serviceKeys['key_management_service_service-keys_headline'],
          ),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(SERVICE_KEY_LIST_TEST_IDS.ctaCreateKey),
      ).not.toHaveAttribute('is-disabled');
    }, WAIT_FOR_DEFAULT_OPTIONS);

    await act(() =>
      user.click(screen.getByTestId(SERVICE_KEY_LIST_TEST_IDS.ctaCreateKey)),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.serviceKeys[
              'key_management_service_service-keys_create_subtitle'
            ],
          ),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.serviceKeys[
              'key_management_service_service-keys_create_crypto_field_size_title'
            ],
          ),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    const keyNameInput = screen.getByPlaceholderText(
      labels.serviceKeys[
        'key_management_service_service-keys_create_general_information_field_name_placeholder'
      ],
    );

    await act(() => {
      fireEvent.change(keyNameInput, { target: { value: '' } });
      fireEvent.change(keyNameInput, {
        target: { value: 'New Key' },
      });
    });

    await waitFor(
      () =>
        expect(
          screen.getByTestId(CREATE_KEY_TEST_IDS.ctaConfirm),
        ).toBeEnabled(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    await act(() =>
      user.click(screen.getByTestId(CREATE_KEY_TEST_IDS.ctaConfirm)),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.serviceKeys[
              'key_management_service_service-keys_create_success'
            ],
          ),
        ).toBeEnabled(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });

  it('should navigate to the service key dashboard page after clicking on a key from the listing', async () => {
    await renderTestApp(mockPageUrl);

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.serviceKeys['key_management_service_service-keys_headline'],
          ),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    await waitFor(
      () =>
        userEvent.click(
          screen.getByTestId(`service-key-link-${serviceKeyMock[0].id}`),
        ),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    const elements = screen.getAllByText(
      labels.serviceKeys[
        'key_management_service_service-keys_dashboard_tab_informations'
      ],
    );
    expect(elements.length).toBeGreaterThan(0);
  });
});
