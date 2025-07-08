import { describe, it, vi, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputCancellable from './InputCancellable.component';

const handleClear = vi.fn();
const handleValidate = vi.fn();
const handleChange = vi.fn();

const InputComponent = ({ isValid }: { isValid?: boolean }) => (
  <InputCancellable
    value="NAME"
    onChange={handleChange}
    onClear={handleClear}
    onSubmit={handleValidate}
    isValid={isValid}
  />
);

describe('Input Component', () => {
  it('should render input with its default value', async () => {
    render(<InputComponent />);

    expect(screen.getByDisplayValue('NAME')).toBeInTheDocument();
  });

  it('should call onChange props', async () => {
    render(<InputComponent />);

    await userEvent.type(screen.getByRole('textbox'), 'new_text');

    expect(handleChange).toHaveBeenCalled();
  });

  it('should call handleClear when cancel', async () => {
    render(<InputComponent />);

    await userEvent.click(screen.getByLabelText('Cancel'));

    expect(handleClear).toHaveBeenCalled();
  });

  it('should call handleValid', async () => {
    render(<InputComponent />);

    await userEvent.click(screen.getByLabelText('Submit'));

    expect(handleValidate).toHaveBeenCalled();
  });

  it('should disabled validate button when input is not valid', async () => {
    render(<InputComponent isValid={false} />);

    expect(screen.getByLabelText('Submit')).toBeDisabled();
  });
});
