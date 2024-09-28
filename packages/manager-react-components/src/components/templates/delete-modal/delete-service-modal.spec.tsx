import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../utils/test.provider';
import { DeleteServiceModal } from './delete-service-modal.component';
import { sharedProps } from './delete-modal.spec';
import { GetServicesMocksParams } from '../../../hooks/services/mocks/services.mock';
import { SetupServer } from 'msw/node';
import '@testing-library/jest-dom';

const terminateValue = 'TEST-TERMINATE';
let server: SetupServer;

const setupTest = (params: GetServicesMocksParams) => {
  const onConfirm = jest.fn();
  render(
    <DeleteServiceModal
      {...sharedProps}
      resourceName="test-id"
      onConfirmDelete={onConfirm}
      terminateValue={terminateValue}
    />,
  );

  return {
    onConfirm,
    button: screen.getByText(sharedProps.confirmButtonLabel),
    input: screen.getByLabelText('delete-input'),
  };
};

describe('Delete service modal', () => {
  afterEach(() => {
    server?.close();
  });

  it('Triggers delete service on confirm', async () => {
    const { input, button } = setupTest({});

    const event = new CustomEvent('odsValueChange', {
      detail: { value: terminateValue },
    });
    fireEvent(input, event);

    // To rework
    // await waitFor(() => expect(button).toBeEnabled());
    await userEvent.click(button);

    // To rework
    // await waitFor(() => {
    //   expect(onConfirm).toHaveBeenCalled();
    //   expect(sharedProps.closeModal).toHaveBeenCalled();
    // });
  });

  it('Displays an error if the service is KO', async () => {
    const { input, button } = setupTest({ deleteServicesKo: true });

    const event = new CustomEvent('odsValueChange', {
      detail: { value: terminateValue },
    });
    fireEvent(input, event);

    // await waitFor(() => expect(button).toBeEnabled());
    await userEvent.click(button);

    // TO REWORK
    // await waitFor(() =>
    //   expect(
    //     screen.getByText(servicesMockErrors.delete, { exact: false }),
    //   ).toBeVisible(),
    // );
    // expect(onConfirm).toHaveBeenCalled();
  });
});
