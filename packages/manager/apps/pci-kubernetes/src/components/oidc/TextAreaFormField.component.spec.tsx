import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TTextAreaFormFieldProps, TextAreaFormField } from './TextAreaFormField.component';

vi.mock('@ovhcloud/ods-components/react', () => ({
  OsdsTextarea: vi.fn(({ className, onOdsValueChange, onOdsBlur, ...props }) => (
    <textarea
      data-testid={props['data-testid']}
      className={className}
      onChange={(e) => onOdsValueChange && onOdsValueChange(e.target.value)}
      onBlur={() => onOdsBlur && onOdsBlur()}
      {...props}
    />
  )),
}));

describe('TextAreaFormField', () => {
  const defaultProps: TTextAreaFormFieldProps = {
    name: 'testField',
    value: 'Initial value',
    placeholder: 'Enter text',
    onOdsBlur: vi.fn(),
    onBlur: vi.fn(),
    onOdsValueChange: vi.fn(),
    error: false,
    onChange: vi.fn(),
  };

  it('renders correctly with default props', () => {
    render(<TextAreaFormField {...defaultProps} />);

    const textarea = screen.getByTestId('testField-textarea');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue('Initial value');
    expect(textarea).toHaveAttribute('placeholder', 'Enter text');
    expect(textarea).not.toHaveClass('bg-red-100');
  });

  it('applies error styles when error is true', () => {
    render(<TextAreaFormField {...defaultProps} error />);

    const textarea = screen.getByTestId('testField-textarea');
    expect(textarea).toHaveClass('bg-red-100');
  });

  it('calls onChange when value changes', () => {
    render(<TextAreaFormField {...defaultProps} />);

    const textarea = screen.getByTestId('testField-textarea');
    fireEvent.change(textarea, { target: { value: 'New value' } });

    expect(defaultProps.onOdsValueChange).toHaveBeenCalledWith('New value');
  });

  it('calls onBlur when focus is lost', () => {
    render(<TextAreaFormField {...defaultProps} />);

    const textarea = screen.getByTestId('testField-textarea');
    fireEvent.blur(textarea);

    expect(defaultProps.onOdsBlur).toHaveBeenCalled();
  });

  it('passes additional props to OsdsTextarea', () => {
    render(<TextAreaFormField {...defaultProps} data-custom="customValue" />);

    const textarea = screen.getByTestId('testField-textarea');
    expect(textarea).toHaveAttribute('data-custom', 'customValue');
  });
});
