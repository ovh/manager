import '@/common/setupTests';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { wrapper } from '@/common/utils/test.provider';
import TransferAuthInfoModal from './TransferAuthInfoModal';

describe('TransferAuthInfoModal component', () => {
  const mockOnClose = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal with correct title', () => {
    render(
      <TransferAuthInfoModal
        open={true}
        isAuthInfoLoading={false}
        authInfoManagedByOVH={true}
        authInfo="AUTH123456"
        onClose={mockOnClose}
      />,
      { wrapper },
    );

    expect(
      screen.getByText(
        'domain_tab_general_information_transfer_authinfo_modal_title',
      ),
    ).toBeInTheDocument();
  });

  it('displays info and warning messages', () => {
    render(
      <TransferAuthInfoModal
        open={true}
        isAuthInfoLoading={false}
        authInfoManagedByOVH={true}
        authInfo="AUTH123456"
        onClose={mockOnClose}
      />,
      { wrapper },
    );

    expect(
      screen.getByText(
        'domain_tab_general_information_transfer_authinfo_modal_info_msg',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'domain_tab_general_information_transfer_authinfo_modal_warning_msg',
      ),
    ).toBeInTheDocument();
  });

  it('shows clipboard with authInfo when managed by OVH and authInfo exists', () => {
    render(
      <TransferAuthInfoModal
        open={true}
        isAuthInfoLoading={false}
        authInfoManagedByOVH={true}
        authInfo="AUTH123456"
        onClose={mockOnClose}
      />,
      { wrapper },
    );

    expect(screen.getByText('Copy to clipboard')).toBeInTheDocument();
  });

  it('shows not supported message when authInfo is not managed by OVH', () => {
    render(
      <TransferAuthInfoModal
        open={true}
        isAuthInfoLoading={false}
        authInfoManagedByOVH={false}
        authInfo="AUTH123456"
        onClose={mockOnClose}
      />,
      { wrapper },
    );

    expect(
      screen.getByText(
        'domain_tab_general_information_transfer_authinfo_modal_info_not_supported',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('clipboard')).not.toBeInTheDocument();
  });

  it('shows not supported message when authInfo is null', () => {
    render(
      <TransferAuthInfoModal
        open={true}
        isAuthInfoLoading={false}
        authInfoManagedByOVH={true}
        authInfo={null}
        onClose={mockOnClose}
      />,
      { wrapper },
    );

    expect(
      screen.getByText(
        'domain_tab_general_information_transfer_authinfo_modal_info_not_supported',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('clipboard')).not.toBeInTheDocument();
  });

  it('shows loading state on clipboard when isAuthInfoLoading is true', () => {
    render(
      <TransferAuthInfoModal
        open={true}
        isAuthInfoLoading={true}
        authInfoManagedByOVH={true}
        authInfo="AUTH123456"
        onClose={mockOnClose}
      />,
      { wrapper },
    );

    const clipboardInput = screen.getByDisplayValue('AUTH123456');
    expect(clipboardInput).toHaveAttribute('aria-busy', 'true');
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <TransferAuthInfoModal
        open={true}
        isAuthInfoLoading={false}
        authInfoManagedByOVH={true}
        authInfo="AUTH123456"
        onClose={mockOnClose}
      />,
      { wrapper },
    );

    const buttons = screen.getAllByRole('button');
    const closeButton = buttons[buttons.length - 1];
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not render modal content when open is false', () => {
    const { container } = render(
      <TransferAuthInfoModal
        open={false}
        isAuthInfoLoading={false}
        authInfoManagedByOVH={true}
        authInfo="AUTH123456"
        onClose={mockOnClose}
      />,
      { wrapper },
    );

    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
});
