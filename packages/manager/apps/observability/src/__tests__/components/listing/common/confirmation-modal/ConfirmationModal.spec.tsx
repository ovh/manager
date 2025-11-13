import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { ConfirmationModal } from '@/components/listing/common/confirmation-modal/ConfirmationModal.component';

vi.mock('@ovh-ux/muk', () => ({
  Modal: ({
    children,
    'data-testid': dataTestId,
    ...props
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
    [key: string]: unknown;
  }) => (
    <div data-testid={dataTestId || 'modal'} {...props}>
      {children}
    </div>
  ),
}));

describe('ConfirmationModal', () => {
  it('renders title and message', () => {
    render(
      <ConfirmationModal
        title="Delete tenant"
        message="Are you sure?"
        onDismiss={() => {}}
        confirmButtonLabel="Confirm"
        cancelButtonLabel="Cancel"
      />,
    );

    expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
    expect(screen.getByText('Delete tenant')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-button-test-id')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-button-test-id')).toBeInTheDocument();
  });

  it('shows spinner and hides actions when loading', () => {
    render(
      <ConfirmationModal title="Processing" message="Please wait" onDismiss={() => {}} isLoading />,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('confirm-button-test-id')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cancel-button-test-id')).not.toBeInTheDocument();
  });

  it('displays error message when provided', () => {
    render(
      <ConfirmationModal
        title="Error"
        message="Something went wrong"
        onDismiss={() => {}}
        error="Could not delete"
      />,
    );

    expect(screen.getByTestId('confirmation-modal-error-message')).toBeInTheDocument();
    expect(screen.getByText('Could not delete')).toBeInTheDocument();
  });

  it('calls handlers when clicking buttons', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmationModal
        title="Confirm"
        message="Confirm action"
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        confirmButtonLabel="Confirm"
        cancelButtonLabel="Cancel"
      />,
    );

    await user.click(screen.getByTestId('cancel-button-test-id'));
    expect(onDismiss).toHaveBeenCalledTimes(1);

    await user.click(screen.getByTestId('confirm-button-test-id'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('respects confirm button loading and disabled states', () => {
    render(
      <ConfirmationModal
        title="States"
        message="Check states"
        onDismiss={() => {}}
        onConfirm={() => {}}
        confirmButtonLabel="Confirm"
        isConfirmButtonDisabled
        isConfirmButtonLoading
      />,
    );

    const confirm = screen.getByTestId('confirm-button-test-id');
    expect(confirm).toBeInTheDocument();
  });
});
