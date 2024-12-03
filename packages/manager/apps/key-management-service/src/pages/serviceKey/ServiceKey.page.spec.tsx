import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { okmsMock } from '@/mocks/kms/okms.mock';
import { serviceKeyMock } from '@/mocks/serviceKeys/serviceKeys.mock';
import { labels } from '@/utils/tests/init.i18n';
import { renderTestApp } from '@/utils/tests/renderTestApp';

describe('Service Key dashboard test suite', () => {
  it('should display an error if the API is KO', async () => {
    await renderTestApp(`/${okmsMock[0].id}/keys/${serviceKeyMock[0].id}`, {
      isServiceKeyKO: true,
    });

    await waitFor(
      () => expect(screen.getByAltText('OOPS')).toBeInTheDocument(),
      {
        timeout: 30_000,
      },
    );
  });
  it('should display the kms dashboard page', async () => {
    await renderTestApp(`/${okmsMock[0].id}/keys/${serviceKeyMock[0].id}`);

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

      { timeout: 30_000 },
    );

    expect(screen.queryByAltText('OOPS')).not.toBeInTheDocument();
  });

  it('should open the edit dialog, modify the name, and confirm the changes', async () => {
    const user = userEvent.setup();
    await renderTestApp(`/${okmsMock[0].id}/keys/${serviceKeyMock[0].id}`);

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

      { timeout: 30_000 },
    );
    await waitFor(
      () => expect(screen.getByTestId('edit-button-modal')).toBeEnabled(),
      {
        timeout: 30_000,
      },
    );
    await act(() => user.click(screen.getByTestId('edit-button-modal')));

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.common.key_management_service_modify),
        ).toBeVisible(),
      {
        timeout: 30_000,
      },
    );
    const nameInput = screen.getByLabelText('input-edit-service-key-name');
    await act(() => {
      fireEvent.change(nameInput, { target: { value: '' } });
      fireEvent.change(nameInput, {
        target: { value: 'Updated Encryption Key' },
      });
    });

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.common.key_management_service_modify),
        ).toBeEnabled(),
      {
        timeout: 30_000,
      },
    );
    await act(() =>
      user.click(screen.getByText(labels.common.key_management_service_modify)),
    );

    await waitFor(
      () => {
        expect(
          screen.getByText(
            labels.serviceKeys[
              'key_management_service_service-keys_update_name_success'
            ],
          ),
        ).toBeInTheDocument();
      },
      {
        timeout: 30_000,
      },
    );
  });
});
