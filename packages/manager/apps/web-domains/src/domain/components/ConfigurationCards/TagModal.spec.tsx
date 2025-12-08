import '@/common/setupTests';
import React from 'react';
import { render, screen, fireEvent } from '@/common/utils/test.provider';
import { vi } from 'vitest';
import { wrapper } from '@/common/utils/test.provider';
import TransferTagModal from './TagModal';

describe('TransferTagModal component', () => {
  const mockSetTag = vi.fn();
  const mockHandleTag = vi.fn();
  const mockOnClose = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal with correct title and description', () => {
    render(
      <TransferTagModal
        open={true}
        serviceName="example.com"
        tag=""
        isTransferTagPending={false}
        setTag={mockSetTag}
        handleTag={mockHandleTag}
        onClose={mockOnClose}
      />,
      { wrapper },
    );

    expect(
      screen.getByText('domain_tab_general_information_transfer_tag'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'domain_tab_general_information_transfer_tag_modal_info',
      ),
    ).toBeInTheDocument();
  });

  it('displays service name in modal description', () => {
    render(
      <TransferTagModal
        open={true}
        serviceName="test-domain.fr"
        tag=""
        isTransferTagPending={false}
        setTag={mockSetTag}
        handleTag={mockHandleTag}
        onClose={mockOnClose}
      />,
      { wrapper },
    );

    expect(
      screen.getByText(
        /domain_tab_general_information_transfer_tag_modal_info/,
      ),
    ).toBeInTheDocument();
  });

  it('renders input field with tag value', () => {
    render(
      <TransferTagModal
        open={true}
        serviceName="example.com"
        tag="myTag123"
        isTransferTagPending={false}
        setTag={mockSetTag}
        handleTag={mockHandleTag}
        onClose={mockOnClose}
      />,
      { wrapper },
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('myTag123');
  });

  it('calls setTag when input value changes', () => {
    render(
      <TransferTagModal
        open={true}
        serviceName="example.com"
        tag=""
        isTransferTagPending={false}
        setTag={mockSetTag}
        handleTag={mockHandleTag}
        onClose={mockOnClose}
      />,
      { wrapper },
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'newTag' } });

    expect(mockSetTag).toHaveBeenCalledWith('newTag');
  });

  it('disables confirm button when tag is empty', () => {
    render(
      <TransferTagModal
        open={true}
        serviceName="test-domain.fr"
        tag=""
        isTransferTagPending={false}
        setTag={mockSetTag}
        handleTag={mockHandleTag}
        onClose={mockOnClose}
      />,
      { wrapper },
    );

    const buttons = screen.getAllByRole('button');
    const confirmButton = buttons[1];
    expect(confirmButton).toBeDisabled();
  });

  it('enables confirm button when tag is not empty', () => {
    render(
      <TransferTagModal
        open={true}
        serviceName="test-domain.fr"
        tag="myTag"
        isTransferTagPending={false}
        setTag={mockSetTag}
        handleTag={mockHandleTag}
        onClose={mockOnClose}
      />,
      { wrapper },
    );

    const buttons = screen.getAllByRole('button');
    const confirmButton = buttons[1];
    expect(confirmButton).not.toBeDisabled();
  });

  it('calls handleTag when confirm button is clicked', () => {
    render(
      <TransferTagModal
        open={true}
        serviceName="test-domain.fr"
        tag="myTag"
        isTransferTagPending={false}
        setTag={mockSetTag}
        handleTag={mockHandleTag}
        onClose={mockOnClose}
      />,
      { wrapper },
    );

    const buttons = screen.getAllByRole('button');
    const confirmButton = buttons[1];
    fireEvent.click(confirmButton);

    expect(mockHandleTag).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <TransferTagModal
        open={true}
        serviceName="example.com"
        tag=""
        isTransferTagPending={false}
        setTag={mockSetTag}
        handleTag={mockHandleTag}
        onClose={mockOnClose}
      />,
      { wrapper },
    );

    const buttons = screen.getAllByRole('button');
    const closeButton = buttons[0];
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('shows loading state on input when isTransferTagPending is true', () => {
    render(
      <TransferTagModal
        open={true}
        serviceName="example.com"
        tag="myTag"
        isTransferTagPending={true}
        setTag={mockSetTag}
        handleTag={mockHandleTag}
        onClose={mockOnClose}
      />,
      { wrapper },
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-busy', 'true');
  });

  it('displays error message when transferTagError exists', () => {
    const mockError = new Error('Transfer failed');

    render(
      <TransferTagModal
        open={true}
        serviceName="example.com"
        tag="myTag"
        isTransferTagPending={false}
        transferTagError={mockError}
        setTag={mockSetTag}
        handleTag={mockHandleTag}
        onClose={mockOnClose}
      />,
      { wrapper },
    );

    expect(
      screen.getByText('domain_tab_general_information_transfer_tag_error'),
    ).toBeInTheDocument();
  });

  it('does not display error message when no error', () => {
    render(
      <TransferTagModal
        open={true}
        serviceName="example.com"
        tag="myTag"
        isTransferTagPending={false}
        setTag={mockSetTag}
        handleTag={mockHandleTag}
        onClose={mockOnClose}
      />,
      { wrapper },
    );

    expect(
      screen.queryByText('domain_tab_general_information_transfer_tag_error'),
    ).not.toBeInTheDocument();
  });

  it('does not render modal content when open is false', () => {
    const { container } = render(
      <TransferTagModal
        open={false}
        serviceName="example.com"
        tag=""
        isTransferTagPending={false}
        setTag={mockSetTag}
        handleTag={mockHandleTag}
        onClose={mockOnClose}
      />,
      { wrapper },
    );

    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
});
