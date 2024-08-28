import { waitFor, screen, fireEvent } from '@testing-library/react';
// import { render } from '../../../utils/test.provider';
// import { DeleteServiceModal } from './delete-service-modal.component';
// import { sharedProps } from './delete-modal.spec';
// import {
//   getServicesMocks,
//   servicesMockErrors,
//   GetServicesMocksParams,
// } from '../../../hooks/services/mocks/services.mock';
// import { toMswHandlers } from '../../../../../../playwright-helpers/msw';
import { SetupServer, setupServer } from 'msw/node';
import '@testing-library/jest-dom';

// const terminateValue = 'TEST-TERMINATE';
let server: SetupServer;

// const setupTest = (params: GetServicesMocksParams) => {
//   // @ts-ignore
//   server = setupServer(...toMswHandlers(getServicesMocks(params)));
//   server.listen({ onUnhandledRequest: 'bypass' });

//   const onConfirm = jest.fn();
//   const { container } = render(
//     <DeleteServiceModal
//       {...sharedProps}
//       resourceName="test-id"
//       onConfirmDelete={onConfirm}
//       terminateValue={terminateValue}
//       isOpen={true}
//     />,
//   );

//   return {
//     onConfirm,
//     button: container.querySelector('[label="confirmButtonLabel"]'),
//     input: screen.getByLabelText('delete-input'),
//   };
// };

// waiting for ODS FIX in (_a = this.modalDialog)?.close in ods-modal2.js
describe('Delete service modal', () => {
  afterEach(() => {
    server?.close();
  });
  it('waiting for ods fix', async () => {
    expect(true).toBeTruthy();
  });

  // it('Triggers delete service on confirm', async () => {
  //   const { input, onConfirm, button } = setupTest({});

  //   const event = new CustomEvent('odsValueChange', {
  //     detail: { value: terminateValue },
  //   });
  //   fireEvent(input, event);

  //   await waitFor(() => expect(button).toBeEnabled());
  //   await fireEvent.click(button);

  //   await waitFor(() => {
  //     expect(onConfirm).toHaveBeenCalled();
  //   });
  // });

  // it('Displays an error if the service is KO', async () => {
  //   const { input, onConfirm, button } = setupTest({ deleteServicesKo: true });

  //   const event = new CustomEvent('odsValueChange', {
  //     detail: { value: terminateValue },
  //   });
  //   fireEvent(input, event);

  //   await waitFor(() => expect(button).toBeEnabled());
  //   await fireEvent.click(button);

  //   await waitFor(
  //     () =>
  //       expect(
  //         screen.getByText(servicesMockErrors.delete, { exact: false }),
  //       ).toBeVisible(),
  //     { timeout: 10000 },
  //   );

  //   expect(onConfirm).toHaveBeenCalled();
  // });
});
