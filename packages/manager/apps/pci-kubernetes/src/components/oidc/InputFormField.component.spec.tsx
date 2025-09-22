import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { InputFormField, TInputFormFieldProps } from './InputFormField.component';

vi.mock('@ovhcloud/ods-components/react', () => ({
  OsdsInput: vi.fn(({ className, onOdsValueChange, onOdsInputBlur, ...props }) => (
    <input
      data-testid={props['data-testid']}
      className={className}
      onChange={(e) => onOdsValueChange && onOdsValueChange(e.target.value)}
      onBlur={() => onOdsInputBlur && onOdsInputBlur()}
      {...props}
    />
  )),
  OsdsText: vi.fn(({ children, ...props }) => (
    <span data-testid={props['data-testid']} {...props}>
      {children}
    </span>
  )),
}));

describe('InputFormField', () => {
  const defaultProps: TInputFormFieldProps = {
    name: 'testField',
    value: 'Initial value',
    placeholder: 'Enter text',
    onOdsInputBlur: vi.fn(),
    onOdsValueChange: vi.fn(),
    error: false,
    onChange: vi.fn(),
    onBlur: vi.fn(),
  };

  it('renders correctly with default props', () => {
    render(<InputFormField {...defaultProps} />);

    const input = screen.getByTestId('testField-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Initial value');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
    expect(input).not.toHaveClass('bg-red-100');
  });

  it('applies error styles when error is true', () => {
    render(<InputFormField {...defaultProps} error />);

    const input = screen.getByTestId('testField-input');
    expect(input).toHaveClass('bg-red-100');
  });

  it('calls onChange when value changes', () => {
    render(<InputFormField {...defaultProps} />);

    const input = screen.getByTestId('testField-input');
    fireEvent.change(input, { target: { value: 'New value' } });

    expect(defaultProps.onOdsValueChange).toHaveBeenCalledWith('New value');
  });

  it('calls onBlur when focus is lost', () => {
    render(<InputFormField {...defaultProps} />);

    const input = screen.getByTestId('testField-input');
    fireEvent.blur(input);

    expect(defaultProps.onOdsInputBlur).toHaveBeenCalled();
  });

  it('renders caption text when provided', () => {
    render(<InputFormField {...defaultProps} caption="This is a caption" />);

    const caption = screen.getByText('This is a caption');
    expect(caption).toBeInTheDocument();
    expect(caption).toHaveClass('mt-3');
  });

  it('passes additional props to OsdsInput', () => {
    render(<InputFormField {...defaultProps} data-custom="customValue" />);

    const input = screen.getByTestId('testField-input');
    expect(input).toHaveAttribute('data-custom', 'customValue');
  });
});
