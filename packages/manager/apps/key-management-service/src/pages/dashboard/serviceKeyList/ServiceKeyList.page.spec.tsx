import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import '@testing-library/jest-dom';
import { labels } from '@/utils/tests/init.i18n';
import { okmsMock } from '@/mocks/kms/okms.mock';
import { serviceKeyMock } from '@/mocks/serviceKeys/serviceKeys.mock';

describe('Service Key list test suite', () => {
  it('should display an error if the API is KO', async () => {
    await renderTestApp(`/${okmsMock[0].id}/keys`, {
      isServiceKeyKO: true,
    });

    await waitFor(
      () => expect(screen.getByAltText('OOPS')).toBeInTheDocument(),
      {
        timeout: 30_000,
      },
    );
  });

  it('should display the kms keys listing page', async () => {
    await renderTestApp(`/${okmsMock[0].id}/keys`);

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.serviceKeys['key_management_service_service-keys_headline'],
          ),
        ).toBeVisible(),

      { timeout: 30_000 },
    );

    expect(screen.queryByAltText('OOPS')).not.toBeInTheDocument();
  });

  it(`should navigate to the service key page creation on click on ${labels.serviceKeys['key_management_service_service-keys_cta_create']} and then create a key `, async () => {
    const user = userEvent.setup();
    await renderTestApp(`/${okmsMock[0].id}/keys`);
    await waitFor(
      () =>
        expect(
          screen.getAllByText(
            labels.serviceKeys['key_management_service_service-keys_headline'],
            { exact: false },
          ).length,
        ).toBeGreaterThan(0),
      { timeout: 30_000 },
    );
    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.serviceKeys[
              'key_management_service_service-keys_create_title'
            ],
          ),
        ).toBeEnabled(),
      {
        timeout: 30_000,
      },
    );

    await act(() =>
      user.click(
        screen.getByText(
          labels.serviceKeys[
            'key_management_service_service-keys_create_title'
          ],
        ),
      ),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.serviceKeys[
              'key_management_service_service-keys_create_crypto_field_type_description_oct'
            ],
          ),
        ).toBeVisible(),
      { timeout: 30_000 },
    );
    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.serviceKeys[
              'key_management_service_service-keys_create_crypto_field_usage_description_encrypt_decrypt'
            ],
          ),
        ).toBeVisible(),
      { timeout: 30_000 },
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
          screen.getByText(
            labels.serviceKeys[
              'key_management_service_service-keys_create_cta_submit'
            ],
          ),
        ).toBeEnabled(),
      {
        timeout: 30_000,
      },
    );

    await act(() =>
      user.click(
        screen.getByText(
          labels.serviceKeys[
            'key_management_service_service-keys_create_cta_submit'
          ],
        ),
      ),
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
      {
        timeout: 30_000,
      },
    );
  });

  it('should navigate to the service key dashboard page after clicking on a key from the listing', async () => {
    await renderTestApp(`/${okmsMock[0].id}/keys`);

    await waitFor(
      () =>
        expect(
          screen.getAllByText(
            labels.serviceKeys['key_management_service_service-keys_headline'],
            { exact: false },
          ).length,
        ).toBeGreaterThan(0),
      { timeout: 30_000 },
    );

    await waitFor(
      () =>
        userEvent.click(screen.getByText(serviceKeyMock[0].iam.displayName)),
      {
        timeout: 30_000,
      },
    );
    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.serviceKeys[
              'key_management_service_service-keys_dashboard_tab_informations'
            ],
          ),
        ).toBeVisible(),
      {
        timeout: 30_000,
      },
    );
  });
});
