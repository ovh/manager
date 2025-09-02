import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  assertOdsModalVisibility,
  changeOdsInputValue,
  WAIT_FOR_DEFAULT_OPTIONS,
} from '@ovh-ux/manager-core-test-utils';
import { okmsMock } from '@/mocks/kms/okms.mock';
import { serviceKeyMock } from '@/mocks/serviceKeys/serviceKeys.mock';
import { labels } from '@/utils/tests/init.i18n';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { SERVICE_KEY_TEST_IDS } from './ServiceKeyDashboard.constants';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';

const mockPageUrl = KMS_ROUTES_URLS.serviceKeyDashboard(
  okmsMock[0].id,
  serviceKeyMock[0].id,
);

describe('Service Key dashboard test suite', () => {
  it('should display an error if the API is KO', async () => {
    await renderTestApp(mockPageUrl, {
      isServiceKeyKO: true,
    });

    await waitFor(
      () => expect(screen.getByAltText('OOPS')).toBeInTheDocument(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });

  it('should display the kms dashboard page', async () => {
    await renderTestApp(mockPageUrl);

    await waitFor(
      () =>
        expect(
          screen.getAllByText(
            labels.serviceKeys[
              'key_management_service_service-keys_dashboard_tab_informations'
            ],
            { exact: false },
          ).length,
        ).toBeGreaterThan(0),

      WAIT_FOR_DEFAULT_OPTIONS,
    );

    expect(screen.queryByAltText('OOPS')).not.toBeInTheDocument();
  });

  it('should open the edit dialog, modify the name, and confirm the changes', async () => {
    const user = userEvent.setup();
    const { container } = await renderTestApp(mockPageUrl);

    await waitFor(
      () => expect(screen.getByTestId('truc')).toBeVisible(),

      WAIT_FOR_DEFAULT_OPTIONS,
    );

    await waitFor(
      () =>
        expect(
          screen.getByTestId(SERVICE_KEY_TEST_IDS.editNameButton),
        ).not.toHaveAttribute('is-disabled'),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    await act(() =>
      user.click(screen.getByTestId(SERVICE_KEY_TEST_IDS.editNameButton)),
    );

    await waitFor(
      () => assertOdsModalVisibility({ container, isVisible: true }),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    await changeOdsInputValue({
      inputLabel: 'input-edit-service-key-name',
      inputValue: 'Updated Encryption Key',
    });

    // TEMP: skipped last part
    // TEMP: waiting for fix on <OdsButton /> isDisabled prop
    // TEMP: click impossible if isDisabled is set on <OdsButton />, regardless of its value
    // await waitFor(
    //   () =>
    //     expect(
    //       screen.getByTestId(serviceKeyTestIds.modifyNameButton),
    //     ).toHaveAttribute('is-disabled', 'false'),
    //   WAIT_FOR_DEFAULT_OPTIONS,
    // );
    // await act(() => user.click(screen.getByTestId(serviceKeyTestIds.modifyNameButton)));
    // await waitFor(
    //   () => assertOds18ModalVisibility({ container, isVisible: false }),
    //   WAIT_FOR_DEFAULT_OPTIONS,
    // );
    // await waitFor(() => {
    //   expect(
    //     screen.getByText(
    //       labels.serviceKeys[
    //         'key_management_service_service-keys_update_name_success'
    //       ],
    //     ),
    //   ).toBeVisible();
    // }, WAIT_FOR_DEFAULT_OPTIONS);
  });
});
