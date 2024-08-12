import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import {
  OdsInputValueChangeEventDetail,
  OsdsInput,
} from '@ovhcloud/ods-components';
import { DeletionModal } from '@/components/deletion-modal/DeletionModal.component';

describe('DeletionModal', () => {
  it('renders loading spinner when isPending is true', () => {
    const { getByTestId } = render(
      <DeletionModal
        type="default"
        title="Delete Item"
        isPending
        cancelText="Cancel"
        submitText="Delete"
        onConfirm={vi.fn()}
        onClose={vi.fn()}
        onCancel={vi.fn()}
      >
        <div data-testid="child-content">Child Content</div>
      </DeletionModal>,
    );
    expect(getByTestId('delete-spinner')).toBeInTheDocument();
  });

  it('renders children content when isPending is false', () => {
    const { getByTestId } = render(
      <DeletionModal
        type="default"
        title="Delete Item"
        isPending={false}
        cancelText="Cancel"
        submitText="Delete"
        onConfirm={vi.fn()}
        onClose={vi.fn()}
        onCancel={vi.fn()}
      >
        <div data-testid="child-content">Child Content</div>
      </DeletionModal>,
    );
    expect(getByTestId('child-content')).toBeInTheDocument();
  });

  it('disables submit button when confirmation text does not match', () => {
    const { getByTestId } = render(
      <DeletionModal
        type="default"
        title="Delete Item"
        isPending={false}
        cancelText="Cancel"
        submitText="Delete"
        confirmationText="CONFIRM"
        onConfirm={vi.fn()}
        onClose={vi.fn()}
        onCancel={vi.fn()}
      >
        <div data-testid="child-content">Child Content</div>
      </DeletionModal>,
    );
    const deleteInput = (getByTestId('delete-input') as unknown) as OsdsInput;
    act(() => {
      fireEvent.change(getByTestId('delete-input'), {
        target: { value: 'WRONG' },
      });
      deleteInput.odsValueChange.emit({
        value: 'WRONG',
      } as OdsInputValueChangeEventDetail);
    });
    expect(getByTestId('delete-button_submit')).toBeDisabled();
  });

  it('enables submit button when confirmation text matches', () => {
    const { getByTestId } = render(
      <DeletionModal
        type="default"
        title="Delete Item"
        isPending={false}
        cancelText="Cancel"
        submitText="Delete"
        confirmationText="CONFIRM"
        onConfirm={vi.fn()}
        onClose={vi.fn()}
        onCancel={vi.fn()}
      >
        <div data-testid="child-content">Child Content</div>
      </DeletionModal>,
    );
    const deleteInput = (getByTestId('delete-input') as unknown) as OsdsInput;
    act(() => {
      fireEvent.change(getByTestId('delete-input'), {
        target: { value: 'CONFIRM' },
      });
      deleteInput.odsValueChange.emit({
        value: 'CONFIRM',
      } as OdsInputValueChangeEventDetail);
    });
    expect(getByTestId('delete-button_submit')).not.toBeDisabled();
  });

  it('calls onConfirm when submit button is clicked', () => {
    const onConfirmMock = vi.fn();
    const { getByTestId } = render(
      <DeletionModal
        type="default"
        title="Delete Item"
        isPending={false}
        cancelText="Cancel"
        submitText="Delete"
        confirmationText="CONFIRM"
        onConfirm={onConfirmMock}
        onClose={vi.fn()}
        onCancel={vi.fn()}
      >
        <div data-testid="child-content">Child Content</div>
      </DeletionModal>,
    );
    const deleteInput = (getByTestId('delete-input') as unknown) as OsdsInput;
    act(() => {
      fireEvent.change(getByTestId('delete-input'), {
        target: { value: 'CONFIRM' },
      });
      deleteInput.odsValueChange.emit({
        value: 'CONFIRM',
      } as OdsInputValueChangeEventDetail);
    });
    fireEvent.click(getByTestId('delete-button_submit'));
    expect(onConfirmMock).toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancelMock = vi.fn();
    const { getByTestId } = render(
      <DeletionModal
        type="default"
        title="Delete Item"
        isPending={false}
        cancelText="Cancel"
        submitText="Delete"
        onConfirm={vi.fn()}
        onClose={vi.fn()}
        onCancel={onCancelMock}
      >
        <div data-testid="child-content">Child Content</div>
      </DeletionModal>,
    );
    fireEvent.click(getByTestId('delete-button_cancel'));
    expect(onCancelMock).toHaveBeenCalled();
  });

  it('displays error message when input does not match confirmation text', async () => {
    const { getByTestId } = render(
      <DeletionModal
        type="default"
        title="Delete Item"
        isPending={false}
        cancelText="Cancel"
        submitText="Delete"
        confirmationText="CONFIRM"
        confirmationLabel="Type CONFIRM to delete"
        onConfirm={vi.fn()}
        onClose={vi.fn()}
        onCancel={vi.fn()}
      >
        <div data-testid="child-content">Child Content</div>
      </DeletionModal>,
    );

    const deleteInput = (getByTestId('delete-input') as unknown) as OsdsInput;
    act(() => {
      fireEvent.change(getByTestId('delete-input'), {
        target: { value: 'WRONG' },
      });
      deleteInput.odsValueChange.emit({
        value: 'WRONG',
      } as OdsInputValueChangeEventDetail);
      fireEvent.blur(getByTestId('delete-input'));
      deleteInput.odsInputBlur.emit();
    });
    await waitFor(() =>
      expect(getByTestId('delete-formfield')).toHaveAttribute(
        'error',
        'common_field_error_required',
      ),
    );
  });

  it('displays error message when input is empty', async () => {
    const { getByTestId, debug, container } = render(
      <DeletionModal
        type="default"
        title="Delete Item"
        isPending={false}
        cancelText="Cancel"
        submitText="Delete"
        confirmationText="CONFIRM"
        confirmationLabel="Type CONFIRM to delete"
        onConfirm={vi.fn()}
        onClose={vi.fn()}
        onCancel={vi.fn()}
      >
        <div data-testid="child-content">Child Content</div>
      </DeletionModal>,
    );

    const deleteInput = (getByTestId('delete-input') as unknown) as OsdsInput;
    act(() => {
      fireEvent.blur(getByTestId('delete-input'));
      deleteInput.odsInputBlur.emit();
    });
    await waitFor(() =>
      expect(getByTestId('delete-formfield')).toHaveAttribute(
        'error',
        'common_field_error_required',
      ),
    );
  });
});
