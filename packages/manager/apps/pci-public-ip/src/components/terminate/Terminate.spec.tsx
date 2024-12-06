import { act, fireEvent, render } from '@testing-library/react';
import { vi, describe } from 'vitest';

import { OsdsButton } from '@ovhcloud/ods-components';
import TerminateModal from './Terminate.component';

describe('Terminate component tests', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  it('should display spinner when isPending equal true', () => {
    const propsWithIsPendingTrue = {
      ip: '000.000.000.000',
      isPending: true,
      isPendingTerminate: false,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
    };

    const { queryByTestId } = render(
      <TerminateModal {...propsWithIsPendingTrue} />,
    );

    expect(queryByTestId('pciModal-spinner')).toBeInTheDocument();
    expect(queryByTestId('pciModal-spinner')).toBeVisible();
  });

  it('should display spinner when isPendingTerminate equal true', () => {
    const propsWithIsPendingTerminateTrue = {
      ip: '000.000.000.000',
      isPending: false,
      isPendingTerminate: true,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
    };

    const { queryByTestId } = render(
      <TerminateModal {...propsWithIsPendingTerminateTrue} />,
    );

    expect(queryByTestId('pciModal-spinner')).toBeInTheDocument();
    expect(queryByTestId('pciModal-spinner')).toBeVisible();
  });

  it('should disable the submit button when the isPending equal true', () => {
    const propsWithIsPendingFalse = {
      ip: '000.000.000.000',
      isPending: true,
      isPendingTerminate: false,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
    };

    const { queryByTestId } = render(
      <TerminateModal {...propsWithIsPendingFalse} />,
    );

    const submitButton = (queryByTestId(
      'pciModal-button_submit',
    ) as unknown) as OsdsButton;

    expect(submitButton).toHaveAttribute('disabled');
    expect(submitButton.disabled).toBe(true);
  });

  it('should disable the submit button when the isTerminatePending equal true', () => {
    const propsWithIsPendingFalse = {
      ip: '000.000.000.000',
      isPending: false,
      isPendingTerminate: true,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
    };

    const { queryByTestId } = render(
      <TerminateModal {...propsWithIsPendingFalse} />,
    );

    const submitButton = (queryByTestId(
      'pciModal-button_submit',
    ) as unknown) as OsdsButton;

    expect(submitButton).toHaveAttribute('disabled');
    expect(submitButton.disabled).toBe(true);
  });

  it('should not disable the submit button when the isPending and isPendingTerminate are both false', () => {
    const propsWithIsPendingFalse = {
      ip: '000.000.000.000',
      isPending: false,
      isPendingTerminate: false,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
    };

    const { queryByTestId } = render(
      <TerminateModal {...propsWithIsPendingFalse} />,
    );

    const submitButton = queryByTestId('pciModal-button_submit');

    expect(submitButton).not.toHaveAttribute('disabled');
  });

  it('should handle onClose function the the cancel button is clicked', () => {
    const props = {
      ip: '000.000.000.000',
      isPending: false,
      isPendingTerminate: false,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
    };

    const { getByTestId } = render(<TerminateModal {...props} />);

    const cancelButton = getByTestId('pciModal-button_cancel');

    act(() => {
      fireEvent.click(cancelButton);
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should handle onConfirm function when the submit button is clicked', () => {
    const props = {
      ip: '000.000.000.000',
      isPending: false,
      isPendingTerminate: false,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
    };

    const { queryByTestId } = render(<TerminateModal {...props} />);

    const submitButton = queryByTestId('pciModal-button_submit');

    act(() => {
      fireEvent.click(submitButton);
    });

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });
});
