import { waitFor, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../utils/test.provider';
import { UpdateIamNameModal } from './update-iam-name-modal.component';
import { sharedProps } from './update-name-modal.spec';
import {
  getServicesMocks,
  servicesMockErrors,
  GetServicesMocksParams,
} from '../../../hooks/services/mocks/services.mock';
import { toMswHandlers } from '../../../../../../playwright-helpers/msw';
import { SetupServer, setupServer } from 'msw/node';
import '@testing-library/jest-dom';

let server: SetupServer;

const setupTest = (params: GetServicesMocksParams) => {
  // @ts-ignore
  server = setupServer(...toMswHandlers(getServicesMocks(params)));
  server.listen({ onUnhandledRequest: 'bypass' });

  const onConfirm = jest.fn();
  render(
    <UpdateIamNameModal
      {...sharedProps}
      resourceName="test-id"
      onConfirm={onConfirm}
    />,
  );

  return {
    onConfirm,
    button: screen.getByText(sharedProps.confirmButtonLabel),
    input: screen.getByLabelText('update-input'),
  };
};

describe('Update IAM name', () => {
  afterEach(() => {
    server?.close();
  });

  it('Triggers update service name on confirm', async () => {
    const { input, onConfirm, button } = setupTest({});

    const event = new CustomEvent('odsValueChange', {
      detail: { value: 'new name' },
    });
    fireEvent(input, event);
    await userEvent.click(button);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalled();
      expect(sharedProps.closeModal).toHaveBeenCalled();
    });
  });

  it('Displays an error if the service is KO', async () => {
    const { input, onConfirm, button } = setupTest({ updateServicesKo: true });

    const event = new CustomEvent('odsValueChange', {
      detail: { value: 'new name' },
    });
    fireEvent(input, event);
    await userEvent.click(button);

    // TO REWORK
    // await waitFor(
    //   () =>
    //     expect(
    //       screen.getByText(servicesMockErrors.update, { exact: false }),
    //     ).toBeVisible(),
    //   { timeout: 10000 },
    // );

    // expect(onConfirm).toHaveBeenCalled();
  });
});
