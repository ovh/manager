import { fireEvent, render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { PciModal } from './PciModal.component';

const defaultProps = {
  type: 'default',
  title: 'Test Modal',
  isPending: false,
  isDisabled: false,
  onConfirm: vi.fn(),
  onClose: vi.fn(),
  onCancel: vi.fn(),
};

const renderModal = (props) =>
  render(
    <PciModal {...props}>
      <div data-testid="child-content">Child Content</div>
    </PciModal>,
  );

describe('PciModal Tests', () => {
  it('renders children content when isPending is false', () => {
    const { getByTestId } = renderModal(defaultProps);

    expect(getByTestId('child-content')).toBeVisible();
  });

  it('render loading spinner when isPending is true', () => {
    const propsWithIsPendingTrue = { ...defaultProps, isPending: true };

    const { getByTestId } = renderModal(propsWithIsPendingTrue);

    expect(getByTestId('pciModal-spinner')).toBeVisible();
  });

  it('renders modal with warning color when the type equal "warning"', () => {
    const propsWithTypeWarning = { ...defaultProps, type: 'warning' };

    const { getByTestId } = renderModal(propsWithTypeWarning);

    expect(getByTestId('pciModal-modal')).toHaveAttribute('color', 'warning');
  });

  it('renders modal with default color when type is undefined', () => {
    const propsWithNoType = { ...defaultProps, type: undefined };

    const { getByTestId } = renderModal(propsWithNoType);

    expect(getByTestId('pciModal-modal')).toHaveAttribute('color', 'primary');
  });

  it('disables submit button when isDisabled is true', () => {
    const propsWithIsDisabledTrue = { ...defaultProps, isDisabled: true };

    const { getByTestId } = renderModal(propsWithIsDisabledTrue);

    expect(getByTestId('pciModal-button_submit')).toBeDisabled();
  });

  it('enables submit button when isDisabled is false', () => {
    const propsWithIsDisabledFalse = { ...defaultProps, isDisabled: false };

    const { getByTestId } = renderModal(propsWithIsDisabledFalse);

    expect(getByTestId('pciModal-button_submit')).not.toBeDisabled();
  });

  it('calls onConfirm when submit button is clicked', () => {
    const onConfirmMock = vi.fn();
    const propsWithOnConfirmAction = {
      ...defaultProps,
      onConfirm: onConfirmMock,
    };

    const { getByTestId } = renderModal(propsWithOnConfirmAction);

    fireEvent.click(getByTestId('pciModal-button_submit'));

    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancelMock = vi.fn();
    const propsWithOnCancelAction = {
      ...defaultProps,
      onCancel: onCancelMock,
    };

    const { getByTestId } = renderModal(propsWithOnCancelAction);

    fireEvent.click(getByTestId('pciModal-button_cancel'));

    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });

  it('renders submit button with default text when submitText is undefined', () => {
    const { getByText } = renderModal(defaultProps);

    expect(getByText('common_confirm')).toBeVisible();
  });

  it('renders cancel button with default text when cancelText is undefined', () => {
    const { getByText } = renderModal(defaultProps);

    expect(getByText('common_cancel')).toBeVisible();
  });

  it('renders submit button with custom text', () => {
    const propsWithSubmitText = {
      ...defaultProps,
      submitText: 'Custom Submit',
    };

    const { getByText } = renderModal(propsWithSubmitText);

    expect(getByText('Custom Submit')).toBeVisible();
  });

  it('renders cancel button with custom text', () => {
    const propsWithCancelText = {
      ...defaultProps,
      cancelText: 'Custom Cancel',
    };

    const { getByText } = renderModal(propsWithCancelText);

    expect(getByText('Custom Cancel')).toBeVisible();
  });
});
