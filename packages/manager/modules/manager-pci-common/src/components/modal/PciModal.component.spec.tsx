import { fireEvent, render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { PciModal } from './PciModal.component';

describe('PciModal Tests', () => {
  it('render loading spinner when isPending is true', () => {
    const { getByTestId } = render(
      <PciModal
        type="default"
        title="Test Modal"
        isPending
        isDisabled={false}
        cancelText="Cancel"
        submitText="Submit"
        onConfirm={vi.fn()}
        onClose={vi.fn()}
        onCancel={vi.fn()}
      >
        <div>Child Content</div>
      </PciModal>,
    );

    expect(getByTestId('pciModal-spinner')).toBeVisible();
  });

  it('renders modal with warning color', () => {
    const { getByTestId } = render(
      <PciModal
        type="warning"
        title="Test Modal"
        isPending
        isDisabled={false}
        cancelText="Cancel"
        submitText="Submit"
        onConfirm={vi.fn()}
        onClose={vi.fn()}
        onCancel={vi.fn()}
      >
        <div>Child Content</div>
      </PciModal>,
    );

    expect(getByTestId('pciModal-modal')).toHaveAttribute('color', 'warning');
  });

  it('renders modal with default color', () => {
    const { getByTestId } = render(
      <PciModal
        title="Test Modal"
        isPending
        isDisabled={false}
        cancelText="Cancel"
        submitText="Submit"
        onConfirm={vi.fn()}
        onClose={vi.fn()}
        onCancel={vi.fn()}
      >
        <div>Child Content</div>
      </PciModal>,
    );

    expect(getByTestId('pciModal-modal')).toHaveAttribute('color', 'primary');
  });

  it('renders children content when isPending is false', () => {
    const { getByTestId } = render(
      <PciModal
        type="default"
        title="Test Modal"
        isPending={false}
        isDisabled={false}
        cancelText="Cancel"
        submitText="Submit"
        onConfirm={vi.fn()}
        onClose={vi.fn()}
        onCancel={vi.fn()}
      >
        <div data-testid="child-content">Child Content</div>
      </PciModal>,
    );

    expect(getByTestId('child-content')).toBeVisible();
  });

  it('disables submit button when isDisabled is true', () => {
    const { getByTestId } = render(
      <PciModal
        type="default"
        title="Test Modal"
        isPending={false}
        isDisabled
        cancelText="Cancel"
        submitText="Submit"
        onConfirm={vi.fn()}
        onClose={vi.fn()}
        onCancel={vi.fn()}
      >
        <div>Child Content</div>
      </PciModal>,
    );

    expect(getByTestId('pciModal-button_submit')).toBeDisabled();
  });

  it('enables submit button when isDisabled is false', () => {
    const { getByTestId } = render(
      <PciModal
        type="default"
        title="Test Modal"
        isPending={false}
        isDisabled={false}
        cancelText="Cancel"
        submitText="Submit"
        onConfirm={vi.fn()}
        onClose={vi.fn()}
        onCancel={vi.fn()}
      >
        <div>Child Content</div>
      </PciModal>,
    );

    expect(getByTestId('pciModal-button_submit')).not.toBeDisabled();
  });

  it('calls onConfirm when submit button is clicked', () => {
    const onConfirmMock = vi.fn();
    const { getByTestId } = render(
      <PciModal
        type="default"
        title="Test Modal"
        isPending={false}
        isDisabled={false}
        cancelText="Cancel"
        submitText="Submit"
        onConfirm={onConfirmMock}
        onClose={vi.fn()}
        onCancel={vi.fn()}
      >
        <div>Child Content</div>
      </PciModal>,
    );

    fireEvent.click(getByTestId('pciModal-button_submit'));

    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancelMock = vi.fn();
    const { getByTestId } = render(
      <PciModal
        type="default"
        title="Test Modal"
        isPending={false}
        isDisabled={false}
        cancelText="Cancel"
        submitText="Submit"
        onConfirm={vi.fn()}
        onClose={vi.fn()}
        onCancel={onCancelMock}
      >
        <div>Child Content</div>
      </PciModal>,
    );

    fireEvent.click(getByTestId('pciModal-button_cancel'));

    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });

  it('renders submit button and cancel button with default text', () => {
    const { getByText } = render(
      <PciModal
        type="default"
        title="Test Modal"
        isPending={false}
        isDisabled={false}
        onConfirm={vi.fn()}
        onClose={vi.fn()}
        onCancel={vi.fn()}
      >
        <div>Child Content</div>
      </PciModal>,
    );

    expect(getByText('common_confirm')).toBeVisible();
    expect(getByText('common_cancel')).toBeVisible();
  });

  it('renders submit button and cancel button with custom text', () => {
    const { getByText } = render(
      <PciModal
        type="default"
        title="Test Modal"
        isPending={false}
        isDisabled={false}
        onConfirm={vi.fn()}
        onClose={vi.fn()}
        onCancel={vi.fn()}
        submitText="Custom Submit"
        cancelText="Custom Cancel"
      >
        <div>Child Content</div>
      </PciModal>,
    );

    expect(getByText('Custom Submit')).toBeVisible();
    expect(getByText('Custom Cancel')).toBeVisible();
  });
});
