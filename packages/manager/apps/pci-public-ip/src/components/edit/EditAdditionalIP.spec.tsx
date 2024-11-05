import { act, fireEvent, render } from '@testing-library/react';
import { vi, describe } from 'vitest';

import {
  OdsSelectValueChangeEventDetail,
  OsdsButton,
  OsdsSelect,
} from '@ovhcloud/ods-components';
import EditInstanceModal from './EditAdditionalIP.component';

describe('EditInstanceModal component tests', () => {
  const mockOnSelectChange = vi.fn();
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  it('should display spinner when isPending equal true', () => {
    const propsWithIsPendingTrue = {
      selectedIp: '000.000.000.000',
      instances: [],
      selectedInstanceId: 'selected-instance-id',
      isPending: true,
      onSelectChange: mockOnSelectChange,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
    };

    const { queryByTestId } = render(
      <EditInstanceModal {...propsWithIsPendingTrue} />,
    );

    expect(queryByTestId('pciModal-spinner')).toBeInTheDocument();
    expect(queryByTestId('pciModal-spinner')).toBeVisible();
  });

  it('should disable the submit button when the isPending equal true', () => {
    const propsWithIsPendingTrue = {
      selectedIp: '000.000.000.000',
      instances: [],
      selectedInstanceId: 'selected-instance-id',
      isPending: true,
      onSelectChange: mockOnSelectChange,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
    };

    const { queryByTestId } = render(
      <EditInstanceModal {...propsWithIsPendingTrue} />,
    );

    const submitButton = (queryByTestId(
      'pciModal-button_submit',
    ) as unknown) as OsdsButton;

    expect(submitButton).toHaveAttribute('disabled');
    expect(submitButton.disabled).toBe(true);
  });

  it('should not disable the submit button when the isPending equal false', () => {
    const propsWithIsPendingFalse = {
      selectedIp: '000.000.000.000',
      instances: [],
      selectedInstanceId: 'selected-instance-id',
      isPending: false,
      onSelectChange: mockOnSelectChange,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
    };

    const { queryByTestId } = render(
      <EditInstanceModal {...propsWithIsPendingFalse} />,
    );

    const submitButton = queryByTestId('pciModal-button_submit');

    expect(submitButton).not.toHaveAttribute('disabled');
  });

  it('should display instances select when isPending equal false', () => {
    const propsWithIsPendingFalse = {
      selectedIp: '000.000.000.000',
      instances: [],
      selectedInstanceId: 'selected-instance-id',
      isPending: false,
      onSelectChange: mockOnSelectChange,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
    };

    const { queryByTestId } = render(
      <EditInstanceModal {...propsWithIsPendingFalse} />,
    );

    const instancesSelect = queryByTestId('editInstanceModal-select_instances');

    expect(instancesSelect).toBeInTheDocument();
    expect(instancesSelect).toBeVisible();
  });

  it('should set the selectedInstanceId as default value of instances select by default', () => {
    const props = {
      selectedIp: '000.000.000.000',
      instances: [],
      selectedInstanceId: 'selected-instance-id',
      isPending: false,
      onSelectChange: mockOnSelectChange,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
    };

    const { queryByTestId } = render(<EditInstanceModal {...props} />);

    const instancesSelect = queryByTestId('editInstanceModal-select_instances');

    expect(instancesSelect).toHaveValue(props.selectedInstanceId);
  });

  it('should call onSelectChange function after changing the instances select value', () => {
    const props = {
      selectedIp: '000.000.000.000',
      instances: [],
      selectedInstanceId: 'selected-instance-id',
      isPending: false,
      onSelectChange: mockOnSelectChange,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
    };

    const { queryByTestId } = render(<EditInstanceModal {...props} />);

    const instancesSelect = (queryByTestId(
      'editInstanceModal-select_instances',
    ) as unknown) as OsdsSelect;

    instancesSelect.odsValueChange.emit({
      value: 'new-selected-value',
    } as OdsSelectValueChangeEventDetail);

    expect(mockOnSelectChange).toHaveBeenCalledTimes(1);
  });

  it('should handle onClose function the the cancel button is clicked', () => {
    const props = {
      selectedIp: '000.000.000.000',
      instances: [],
      selectedInstanceId: 'selected-instance-id',
      isPending: false,
      onSelectChange: mockOnSelectChange,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
    };

    const { getByTestId } = render(<EditInstanceModal {...props} />);

    const cancelButton = getByTestId('pciModal-button_cancel');

    act(() => {
      fireEvent.click(cancelButton);
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should handle onConfirm function when the submit button is clicked', () => {
    const props = {
      selectedIp: '000.000.000.000',
      instances: [],
      selectedInstanceId: 'selected-instance-id',
      isPending: false,
      onSelectChange: mockOnSelectChange,
      onClose: mockOnClose,
      onConfirm: mockOnConfirm,
    };

    const { queryByTestId } = render(<EditInstanceModal {...props} />);

    const submitButton = queryByTestId('pciModal-button_submit');

    act(() => {
      fireEvent.click(submitButton);
    });

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });
});
