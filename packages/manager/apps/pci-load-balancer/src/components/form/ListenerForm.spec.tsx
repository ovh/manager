import {
  OdsInputValueChangeEventDetail,
  OsdsInput,
} from '@ovhcloud/ods-components';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { wrapper } from '@/wrapperRenders';
import { TLoadBalancerPool } from '@/api/data/pool';
import { TProtocol } from '@/api/data/load-balancer';
import ListenerForm from './ListenerForm.component';

const mockOnChange = vi.fn();
const mockOnSubmit = vi.fn();
const mockOnCancel = vi.fn();

const defaultFormState = {
  name: '',
  protocol: 'HTTP' as TProtocol,
  port: 80,
  pool: null,
};

const mockPools = [
  { id: 'pool1', name: 'Pool 1', protocol: 'http' },
  { id: 'pool2', name: 'Pool 2', protocol: 'https' },
] as TLoadBalancerPool[];

describe('ListenerForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should renders form fields with initial values', () => {
    render(
      <ListenerForm
        formState={defaultFormState}
        pools={mockPools}
        isPending={false}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
      { wrapper },
    );

    expect(screen.getByTestId('ListenerForm_name-input')).toHaveValue('');
    expect(screen.getByTestId('ListenerForm_protocol-select')).toHaveValue(
      'HTTP',
    );
    expect(screen.getByTestId('ListenerForm_port-input')).toHaveValue(80);
  });

  it('should displays spinner while loading', () => {
    render(
      <ListenerForm
        formState={defaultFormState}
        pools={mockPools}
        isPending
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
      { wrapper },
    );

    expect(screen.getByTestId('ListenerForm_spinner')).toBeVisible();
  });

  it('should validate required name field and displays error if empty', async () => {
    render(
      <ListenerForm
        formState={{ ...defaultFormState, name: '' }}
        pools={mockPools}
        isPending={false}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
      { wrapper },
    );

    const nameInput = screen.getByTestId('ListenerForm_name-input');

    act(() => {
      ((nameInput as unknown) as OsdsInput).odsValueChange.emit({
        value: '',
      } as OdsInputValueChangeEventDetail);
      ((nameInput as unknown) as OsdsInput).odsInputBlur.emit();
    });

    expect(screen.getByTestId('ListenerForm_name-field')).toHaveAttribute(
      'error',
      'common_field_error_required',
    );
  });

  it('should call onChange when name, protocol, and port fields are modified', async () => {
    render(
      <ListenerForm
        formState={defaultFormState}
        pools={mockPools}
        isPending={false}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
      { wrapper },
    );

    const nameInput = screen.getByTestId('ListenerForm_name-input');

    act(() => {
      ((nameInput as unknown) as OsdsInput).odsValueChange.emit({
        value: 'New Listener Name',
      } as OdsInputValueChangeEventDetail);
    });

    const portInput = screen.getByTestId('ListenerForm_port-input');

    act(() => {
      ((portInput as unknown) as OsdsInput).odsValueChange.emit({
        value: '8080',
      } as OdsInputValueChangeEventDetail);
    });

    await waitFor(() => expect(mockOnChange).toHaveBeenCalledTimes(2));
  });

  it('should call onSubmit with the form state when the submit button is clicked', async () => {
    render(
      <ListenerForm
        formState={{ ...defaultFormState, name: 'Valid Name' }}
        pools={mockPools}
        isPending={false}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
      { wrapper },
    );

    const submitButton = screen.getByTestId('ListenerForm_submit-button');
    await userEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Valid Name' }),
    );
  });

  it('should call onCancel when the cancel button is clicked', async () => {
    render(
      <ListenerForm
        formState={defaultFormState}
        pools={mockPools}
        isPending={false}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
      { wrapper },
    );

    const cancelButton = screen.getByTestId('ListenerForm_cancel-button');
    await userEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });
});
