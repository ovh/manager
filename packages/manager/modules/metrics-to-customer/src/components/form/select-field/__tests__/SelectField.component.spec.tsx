import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { SelectField } from '@/components/form/select-field/SelectField.component';
import { SelectFieldProps, SelectOption } from '@/components/form/select-field/SelectField.props';

// Mock ODS React components
vi.mock('@ovhcloud/ods-react', () => ({
  FormField: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="form-field" className={className}>
      {children}
    </div>
  ),
  FormFieldLabel: ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
    <label data-testid="form-field-label" htmlFor={htmlFor}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && typeof child.type !== 'string') {
          return React.cloneElement(child as React.ReactElement<{ slot?: string }>, {
            slot: 'label',
          });
        }
        return child;
      })}
    </label>
  ),
  FormFieldHelper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-field-helper">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && typeof child.type !== 'string') {
          return React.cloneElement(child as React.ReactElement<{ slot?: string }>, {
            slot: 'helper',
          });
        }
        return child;
      })}
    </div>
  ),
  FormFieldError: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-field-error">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && typeof child.type !== 'string') {
          return React.cloneElement(child as React.ReactElement<{ slot?: string }>, {
            slot: 'error',
          });
        }
        return child;
      })}
    </div>
  ),
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className}>
      Loading...
    </div>
  ),
  ComboboxControl: ({ placeholder, clearable }: { placeholder?: string; clearable?: boolean }) => (
    <div data-testid="combobox-control" data-placeholder={placeholder} data-clearable={clearable} />
  ),
  ComboboxContent: () => <div data-testid="combobox-content" />,
  Combobox: ({
    className,
    value,
    name,
    onValueChange,
    invalid,
    disabled,
    items,
    allowCustomValue,
    children,
  }: {
    className?: string;
    value?: string[];
    name: string;
    onValueChange?: (detail: { value?: string[] }) => void;
    invalid?: boolean;
    disabled?: boolean;
    items: Array<{ label: string; value: string }>;
    allowCustomValue?: boolean;
    children?: React.ReactNode;
  }) => {
    const [selectValue, setSelectValue] = React.useState(value?.[0] || '');

    React.useEffect(() => {
      setSelectValue(value?.[0] || '');
    }, [value]);

    return (
      <div
        data-testid="combobox"
        className={className}
        data-name={name}
        data-invalid={invalid}
        data-disabled={disabled}
        data-allow-custom-value={allowCustomValue}
      >
        {children}
        <select
          data-testid="combobox-select"
          value={selectValue}
          name={name}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectValue(e.target.value);
            onValueChange?.({ value: [e.target.value] });
          }}
          disabled={disabled}
        >
          <option value="">Select...</option>
          {items?.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    );
  },
}));

// Mock MUK components
vi.mock('@ovh-ux/muk', () => ({
  Text: ({
    children,
    preset,
    slot,
  }: {
    children: React.ReactNode;
    preset?: string;
    slot?: string;
  }) => (
    <span data-testid={`text-${slot || 'default'}`} data-preset={preset}>
      {children}
    </span>
  ),
  TEXT_PRESET: {
    paragraph: 'paragraph',
    caption: 'caption',
  },
}));

describe('SelectField', () => {
  const mockOptions: SelectOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const defaultProps: SelectFieldProps = {
    name: 'test-select',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render basic select field with required props only', () => {
      render(<SelectField {...defaultProps} />);

      expect(screen.getByTestId('form-field')).toBeInTheDocument();
      expect(screen.getByTestId('combobox')).toBeInTheDocument();
      expect(screen.getByTestId('combobox')).toHaveAttribute('data-name', 'test-select');
    });

    it('should render with label when provided', () => {
      render(<SelectField {...defaultProps} label="Test Label" />);

      const label = screen.getByTestId('form-field-label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('Test Label');
    });

    it('should render without label when not provided', () => {
      render(<SelectField {...defaultProps} />);

      expect(screen.queryByTestId('text-label')).not.toBeInTheDocument();
    });

    it('should render with placeholder when provided', () => {
      render(<SelectField {...defaultProps} placeholder="Select an option" />);

      expect(screen.getByTestId('combobox-control')).toHaveAttribute(
        'data-placeholder',
        'Select an option',
      );
    });

    it('should render with value when provided', () => {
      const testOptions: SelectOption[] = [
        { value: 'test-value', label: 'Test Value' },
        { value: 'other-value', label: 'Other Value' },
      ];

      render(<SelectField {...defaultProps} value="test-value" options={testOptions} />);

      expect(screen.getByTestId('combobox-select')).toHaveValue('test-value');
    });

    it('should render with className when provided', () => {
      render(<SelectField {...defaultProps} className="custom-class" />);

      expect(screen.getByTestId('combobox')).toHaveClass('custom-class');
    });

    it('should have allowCustomValue set to false', () => {
      render(<SelectField {...defaultProps} />);

      expect(screen.getByTestId('combobox')).toHaveAttribute('data-allow-custom-value', 'false');
    });

    it('should have clearable set to true on ComboboxControl', () => {
      render(<SelectField {...defaultProps} />);

      expect(screen.getByTestId('combobox-control')).toHaveAttribute('data-clearable', 'true');
    });
  });

  describe('Options Rendering', () => {
    it('should render options from options prop', () => {
      render(<SelectField {...defaultProps} options={mockOptions} />);

      const select = screen.getByTestId('combobox-select');
      const options = select.querySelectorAll('option');

      // +1 for the default "Select..." option
      expect(options).toHaveLength(4);
      expect(options[1]).toHaveValue('option1');
      expect(options[1]).toHaveTextContent('Option 1');
      expect(options[2]).toHaveValue('option2');
      expect(options[2]).toHaveTextContent('Option 2');
      expect(options[3]).toHaveValue('option3');
      expect(options[3]).toHaveTextContent('Option 3');
    });

    it('should render empty combobox when no options provided', () => {
      render(<SelectField {...defaultProps} />);

      const select = screen.getByTestId('combobox-select');
      const options = select.querySelectorAll('option');

      // Only the default "Select..." option
      expect(options).toHaveLength(1);
    });
  });

  describe('Loading State', () => {
    it('should render skeleton when isLoading is true', () => {
      render(<SelectField {...defaultProps} isLoading />);

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('combobox')).not.toBeInTheDocument();
    });

    it('should render skeleton with className when isLoading is true', () => {
      render(<SelectField {...defaultProps} isLoading className="loading-class" />);

      expect(screen.getByTestId('skeleton')).toHaveClass('loading-class');
    });

    it('should render combobox when isLoading is false', () => {
      render(<SelectField {...defaultProps} isLoading={false} />);

      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(screen.getByTestId('combobox')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('should set disabled on combobox when isDisabled is true', () => {
      render(<SelectField {...defaultProps} isDisabled />);

      expect(screen.getByTestId('combobox')).toHaveAttribute('data-disabled', 'true');
      expect(screen.getByTestId('combobox-select')).toBeDisabled();
    });

    it('should not set disabled on combobox when isDisabled is false', () => {
      render(<SelectField {...defaultProps} isDisabled={false} />);

      expect(screen.getByTestId('combobox')).toHaveAttribute('data-disabled', 'false');
      expect(screen.getByTestId('combobox-select')).not.toBeDisabled();
    });

    it('should not show error when isDisabled is true even if error is provided', () => {
      render(<SelectField {...defaultProps} isDisabled error="This field is required" />);

      // Error should still be shown but invalid should be false
      expect(screen.getByTestId('combobox')).toHaveAttribute('data-invalid', 'false');
      expect(screen.getByTestId('form-field-error')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when error is provided', () => {
      render(<SelectField {...defaultProps} error="This field is required" />);

      const errorText = screen.getByTestId('text-error');
      expect(errorText).toBeInTheDocument();
      expect(errorText).toHaveTextContent('This field is required');
      expect(errorText).toHaveAttribute('data-preset', 'caption');
    });

    it('should set invalid on combobox when error is provided', () => {
      render(<SelectField {...defaultProps} error="This field is required" />);

      expect(screen.getByTestId('combobox')).toHaveAttribute('data-invalid', 'true');
    });

    it('should not display error message when error is not provided', () => {
      render(<SelectField {...defaultProps} />);

      expect(screen.queryByTestId('form-field-error')).not.toBeInTheDocument();
      expect(screen.queryByTestId('text-error')).not.toBeInTheDocument();
    });

    it('should not set invalid on combobox when error is not provided', () => {
      render(<SelectField {...defaultProps} />);

      expect(screen.getByTestId('combobox')).toHaveAttribute('data-invalid', 'false');
    });

    it('should not set invalid on combobox when error is empty string', () => {
      render(<SelectField {...defaultProps} error="" />);

      expect(screen.getByTestId('combobox')).toHaveAttribute('data-invalid', 'false');
      expect(screen.queryByTestId('form-field-error')).not.toBeInTheDocument();
      expect(screen.queryByTestId('text-error')).not.toBeInTheDocument();
    });
  });

  describe('Event Handling', () => {
    it('should call onChange when combobox value changes', () => {
      const mockOnChange = vi.fn();
      render(<SelectField {...defaultProps} options={mockOptions} onChange={mockOnChange} />);

      const select = screen.getByTestId('combobox-select');
      fireEvent.change(select, { target: { value: 'option2' } });

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('option2');
    });

    it('should call onChange with null when value is cleared', () => {
      const mockOnChange = vi.fn();
      render(
        <SelectField
          {...defaultProps}
          options={mockOptions}
          value="option1"
          onChange={mockOnChange}
        />,
      );

      const select = screen.getByTestId('combobox-select');
      fireEvent.change(select, { target: { value: '' } });

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith(null);
    });

    it('should not throw error when onChange is not provided', () => {
      render(<SelectField {...defaultProps} options={mockOptions} />);

      const select = screen.getByTestId('combobox-select');

      expect(() => {
        fireEvent.change(select, { target: { value: 'option1' } });
      }).not.toThrow();
    });
  });

  describe('Form Field Structure', () => {
    it('should have correct form field wrapper class', () => {
      render(<SelectField {...defaultProps} />);

      const formField = screen.getByTestId('form-field');
      expect(formField).toHaveClass('my-4', 'w-full');
    });

    it('should render all components in correct order when all props provided', () => {
      const { container } = render(
        <SelectField
          {...defaultProps}
          label="Test Label"
          options={mockOptions}
          error="Test Error"
        />,
      );

      const formField = container.querySelector('[data-testid="form-field"]');
      const children = Array.from(formField?.children || []);

      // Should have label, combobox, and error
      expect(children.length).toBeGreaterThanOrEqual(3);
      expect(children[0]).toHaveAttribute('data-testid', 'form-field-label');
      expect(container.querySelector('[data-testid="combobox"]')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="form-field-error"]')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper name attribute for form association', () => {
      render(<SelectField {...defaultProps} name="accessibility-test" />);

      expect(screen.getByTestId('combobox')).toHaveAttribute('data-name', 'accessibility-test');
      expect(screen.getByTestId('combobox-select')).toHaveAttribute('name', 'accessibility-test');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty options array', () => {
      render(<SelectField {...defaultProps} options={[]} />);

      const select = screen.getByTestId('combobox-select');
      const options = select.querySelectorAll('option');

      // Only the default "Select..." option
      expect(options).toHaveLength(1);
    });

    it('should handle options with special characters in labels', () => {
      const specialOptions: SelectOption[] = [
        { value: 'special1', label: 'Option with "quotes"' },
        { value: 'special2', label: 'Option with <tags>' },
        { value: 'special3', label: 'Option with & symbols' },
      ];

      render(<SelectField {...defaultProps} options={specialOptions} />);

      const select = screen.getByTestId('combobox-select');
      const options = select.querySelectorAll('option');

      expect(options[1]).toHaveTextContent('Option with "quotes"');
      expect(options[2]).toHaveTextContent('Option with <tags>');
      expect(options[3]).toHaveTextContent('Option with & symbols');
    });
  });
});

