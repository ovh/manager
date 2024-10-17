import { describe, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteModal from './DeleteModal.component';

describe('DeleteModal', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  it('should render spinner when isPending is true', () => {
    render(
      <DeleteModal
        networkId="network1"
        isPending={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );
    expect(screen.getByTestId('deleteModal-spinner')).toBeInTheDocument();
  });

  it('should render confirmation text when isPending is false', () => {
    render(
      <DeleteModal
        networkId="network1"
        isPending={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );
    expect(
      screen.getByText(
        'pci_projects_project_network_private_delete_confirmation',
      ),
    ).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', () => {
    const { getByTestId } = render(
      <DeleteModal
        networkId="network1"
        isPending={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );
    const cancelButton = getByTestId('deleteModal-button_cancel');

    act(() => {
      fireEvent.click(cancelButton);
    });
    userEvent.click(
      screen.getByText('pci_projects_project_network_private_delete_cancel'),
    );
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onConfirm when confirm button is clicked', () => {
    const { getByTestId } = render(
      <DeleteModal
        networkId="network1"
        isPending={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );
    const confirmButton = getByTestId('deleteModal-button_confirm');

    act(() => {
      fireEvent.click(confirmButton);
    });
    userEvent.click(
      screen.getByText('pci_projects_project_network_private_delete_cancel'),
    );
    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it('should disable confirm button when isPending is true', () => {
    render(
      <DeleteModal
        networkId="network1"
        isPending={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );
    expect(
      screen.getByText('pci_projects_project_network_private_delete_confirm'),
    ).toBeDisabled();
  });
});
