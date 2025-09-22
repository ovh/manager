import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { OdsInputValueChangeEventDetail, OsdsInput } from '@ovhcloud/ods-components';

import RestrictionLine from './RestrictionLine.component';

const mockProps = {
  ip: '192.168.0.1',
  ipIndex: 0,
  disabled: false,
  onSave: vi.fn(),
  onClose: vi.fn(),
  onDelete: vi.fn(),
};

describe('RestrictionLine', () => {
  it('renders input field when editing', () => {
    const { getByTestId } = render(<RestrictionLine {...mockProps} ip="" />);
    expect(getByTestId('input-ip')).toBeInTheDocument();
  });

  it('calls onSave when check button is clicked', async () => {
    const { getByTestId } = render(<RestrictionLine {...mockProps} ip="" disabled={undefined} />);
    const input = getByTestId('input-ip') as unknown as OsdsInput;
    act(() => {
      input.odsValueChange.emit({
        value: '10.0.0.1',
      } as OdsInputValueChangeEventDetail);
    });

    fireEvent.click(getByTestId('pen-icon-save'));
    await waitFor(() => expect(mockProps.onSave).toHaveBeenCalledWith('10.0.0.1', 0));
  });

  it('calls onDelete when trash button is clicked', () => {
    const { getByTestId } = render(<RestrictionLine {...mockProps} />);
    fireEvent.click(getByTestId('trash-icon-delete'));
    expect(mockProps.onDelete).toHaveBeenCalledWith('192.168.0.1');
  });

  it('calls onClose when close button is clicked', () => {
    const { getByTestId } = render(<RestrictionLine {...mockProps} ip="" />);
    fireEvent.click(getByTestId('trash-icon-close'));
    expect(mockProps.onClose).toHaveBeenCalledWith('', 0);
  });
});
