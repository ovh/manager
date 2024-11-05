import { fireEvent, render, screen } from '@testing-library/react';
import { describe, vi, test } from 'vitest';
import { DeleteModal } from './DeleteModal.component';

const handleModalClose = vi.fn();
const handleModalConfirm = vi.fn();

const initialProps = {
  instanceName: 'foo',
  isPending: false,
  onModalClose: handleModalClose,
  onModalConfirm: handleModalConfirm,
};

const initRender = (isLoading?: boolean) => {
  render(
    <DeleteModal
      {...initialProps}
      {...(isLoading !== undefined && { isPending: isLoading })}
    />,
  );
};

describe('Regarding the DeleteModal component', () => {
  test('should render a Spinner if component is in pending state', () => {
    initRender(true);
    const spinnerElement = screen.getByTestId('spinner');
    expect(spinnerElement).toBeInTheDocument();
  });
  test('Should render the component with given props', () => {
    initRender();
    const modalElement = screen.getByText(
      'pci_instances_delete_instance_confirmation_message',
    );
    expect(modalElement).toBeInTheDocument();
    const confirmButtonELement = screen.getByText(
      'common:pci_instances_common_confirm',
    );
    const cancelButtonELement = screen.getByText(
      'common:pci_instances_common_cancel',
    );
    fireEvent.click(confirmButtonELement);
    expect(handleModalConfirm).toHaveBeenCalled();
    fireEvent.click(cancelButtonELement);
    expect(handleModalClose).toHaveBeenCalled();
  });
});
