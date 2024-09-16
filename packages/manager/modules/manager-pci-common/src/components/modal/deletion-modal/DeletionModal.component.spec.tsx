import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import {
  OdsInputValueChangeEventDetail,
  OsdsInput,
} from '@ovhcloud/ods-components';
import { DeletionModal } from '@/components/modal/deletion-modal/DeletionModal.component';

describe('DeletionModal', () => {
  it('should disable submit button when confirmation text does not match', () => {
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

    expect(getByTestId('pciModal-button_submit')).toBeDisabled();
  });

  it('should enable submit button when confirmation text matches', () => {
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

    expect(getByTestId('pciModal-button_submit')).not.toBeDisabled();
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
      expect(getByTestId('delete-formField')).toHaveAttribute(
        'error',
        'common_field_error_required',
      ),
    );
  });

  it('displays error message when input is empty', async () => {
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
      fireEvent.blur(getByTestId('delete-input'));
      deleteInput.odsInputBlur.emit();
    });

    await waitFor(() =>
      expect(getByTestId('delete-formField')).toHaveAttribute(
        'error',
        'common_field_error_required',
      ),
    );
  });
});
