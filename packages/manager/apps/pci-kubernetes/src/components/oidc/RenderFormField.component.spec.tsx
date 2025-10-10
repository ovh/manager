import { render, screen } from '@testing-library/react';
import { Control, UseFormReturn, useFormContext } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

import RenderFormField from './RenderFormField.component';

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

vi.mock('./InputFormField.component', () => ({
  InputFormField: vi.fn(
    ({ name, value, onChange, onBlur, placeholder, error, 'data-testid': dataTestId }) => (
      <input
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        data-testid={dataTestId}
        aria-invalid={error ? 'true' : 'false'}
      />
    ),
  ),
}));

describe('RenderFormField', () => {
  const mockFormContext = {
    control: {},
    formState: {
      errors: {},
    },
  } as UseFormReturn<Record<string, unknown>>;

  beforeEach(() => {
    vi.mocked(useFormContext).mockReturnValue(mockFormContext);
  });

  const testCases = [
    {
      name: 'issuerUrl' as const,
      label: 'Issuer URL Label',
      description: 'Issuer URL Description',
      placeholder: 'Enter issuer URL',
      error: 'Issuer URL Error',
    },
    {
      name: 'clientId' as const,
      label: 'Client ID Label',
      description: 'Client ID Description',
      placeholder: 'Enter client ID',
      error: 'Client ID Error',
    },
  ];

  testCases.forEach(({ name, label, description, placeholder, error }) => {
    describe(`when rendering ${name}`, () => {
      it('renders the form field with label and description', () => {
        render(
          <RenderFormField
            name={name}
            label={label}
            description={description}
            placeholder={placeholder}
            control={mockFormContext.control}
          />,
        );

        const formField = screen.getByTestId(`${name}-formfield`);
        expect(formField).toBeInTheDocument();
        expect(screen.getByText(label)).toBeInTheDocument();
        expect(screen.getByText(description)).toBeInTheDocument();
      });

      it('renders the input component with correct props', () => {
        render(
          <RenderFormField
            name={name}
            label={label}
            description={description}
            placeholder={placeholder}
            control={mockFormContext.control}
          />,
        );

        const input = screen.getByTestId(`${name}-input`);
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('name', name);
        expect(input).toHaveAttribute('placeholder', placeholder);
      });

      it('passes the correct props to the Controller', () => {
        const mockControl = { [name]: vi.fn() } as unknown as Control<Record<string, unknown>>;
        vi.mocked(useFormContext).mockReturnValue({
          ...mockFormContext,
          control: mockControl,
        });

        render(
          <RenderFormField
            name={name}
            label={label}
            description={description}
            placeholder={placeholder}
            control={mockFormContext.control}
          />,
        );

        const inputt = screen.getByTestId(`${name}-formfield`);
        expect(inputt).toBeInTheDocument();
      });

      it('renders error message if provided', () => {
        render(
          <RenderFormField
            name={name}
            label={label}
            description={description}
            placeholder={placeholder}
            control={mockFormContext.control}
            error={error}
          />,
        );

        const formField = screen.getByTestId(`${name}-input`);
        expect(formField).toHaveAttribute('aria-invalid', 'true');
      });
    });
  });
});
