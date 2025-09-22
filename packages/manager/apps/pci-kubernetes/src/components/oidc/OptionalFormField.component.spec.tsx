import { render, screen } from '@testing-library/react';
import { Control, UseFormReturn, useFormContext } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

import { OptionalFormField } from './OptionalFormField.component';

vi.mock('react-hook-form', () => ({
  useFormContext: vi.fn(),
  Controller: vi.fn(({ render: renderFn }) => {
    const mockField = { onBlur: vi.fn(), onChange: vi.fn(), value: '' };
    return renderFn({ field: mockField });
  }),
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  OsdsFormField: vi.fn(({ children, ...props }) => (
    <div data-testid={props['data-testid']} className={props.className}>
      {children}
    </div>
  )),
  OsdsText: vi.fn(({ children, slot }) => <div slot={slot}>{children}</div>),
}));

vi.mock('@/helpers', () => ({
  getErrorMessage: vi.fn((error) => error?.message || ''),
}));

describe('OptionalFormField', () => {
  const defaultProps = {
    name: 'testField',
    label: 'Test Label',
    description: 'Test Description',
    dataTestId: 'test-field',
    placeholder: 'Enter text',
    caption: 'Optional caption',
    component: vi.fn(({ name, value, onChange, onBlur, caption }) => (
      <div>
        <input
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder="Enter text"
          data-testid={`${name}-input`}
        />
        {caption && <div data-testid={`${name}-caption`}>{caption}</div>}
      </div>
    )),
  };

  const mockFormContext = {
    control: {},
    formState: {
      errors: {},
    },
  } as UseFormReturn<Record<string, unknown>>;

  beforeEach(() => {
    vi.mocked(useFormContext).mockReturnValue(mockFormContext);
  });

  it('renders the form field with label and description', () => {
    render(<OptionalFormField {...defaultProps} />);

    const formField = screen.getByTestId('test-field-formfield');
    expect(formField).toBeInTheDocument();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders the input component with correct props', () => {
    render(<OptionalFormField {...defaultProps} />);

    const input = screen.getByTestId('testField-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'testField');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
  });

  it('passes the correct props to the Controller', () => {
    const mockControl = { testField: vi.fn() } as unknown as Control<Record<string, unknown>>;

    const mockContextControl = {
      ...mockFormContext,
      control: mockControl,
    };
    vi.mocked(useFormContext).mockReturnValue(mockContextControl);

    render(<OptionalFormField {...defaultProps} />);

    const input = screen.getByTestId('testField-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'testField');
  });
  const defaultCaptionProps = {
    name: 'groupsClaim',
    ...defaultProps,
  };
  it('renders caption if provided', () => {
    render(<OptionalFormField {...defaultCaptionProps} />);

    expect(screen.getByText('Optional caption')).toBeInTheDocument();
  });
});
