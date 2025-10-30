import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { SelectField } from '@/components/form/select-field/SelectField.component';
import { SelectFieldProps, SelectOption } from '@/components/form/select-field/SelectField.props';

// Mock ODS components
vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsFormField: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="form-field" className={className}>
      {children}
    </div>
  ),
  OdsSelect: ({
    children,
    className,
    value,
    name,
    placeholder,
    onOdsChange,
    hasError,
  }: {
    children: React.ReactNode;
    className?: string;
    value?: string;
    name: string;
    placeholder?: string;
    onOdsChange?: (event: { detail: { value?: string | null } }) => void;
    hasError?: boolean;
  }) => {
    const [selectValue, setSelectValue] = React.useState(value || '');

    React.useEffect(() => {
      setSelectValue(value || '');
    }, [value]);

    return (
      <select
        {...({
          'data-testid': 'select-field',
          className,
          value: selectValue,
          name,
          placeholder,
          onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectValue(e.target.value);
            onOdsChange?.({ detail: { value: e.target.value } });
          },
          'data-has-error': hasError,
        } as unknown as React.ChangeEvent<HTMLSelectElement>)}
      >
        {children}
      </select>
    );
  },
  OdsSkeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className}>
      Loading...
    </div>
  ),
  OdsText: ({
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
}));

// Mock ODS constants
vi.mock('@ovhcloud/ods-components', () => ({
  ODS_TEXT_PRESET: {
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
      expect(screen.getByTestId('select-field')).toBeInTheDocument();
      expect(screen.getByTestId('select-field')).toHaveAttribute('name', 'test-select');
    });

    it('should render with label when provided', () => {
      render(<SelectField {...defaultProps} label="Test Label" />);

      const label = screen.getByTestId('text-label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('Test Label');
      expect(label).toHaveAttribute('data-preset', 'paragraph');
    });

    it('should render without label when not provided', () => {
      render(<SelectField {...defaultProps} />);

      expect(screen.queryByTestId('text-label')).not.toBeInTheDocument();
    });

    it('should render with placeholder when provided', () => {
      render(<SelectField {...defaultProps} placeholder="Select an option" />);

      expect(screen.getByTestId('select-field')).toHaveAttribute('placeholder', 'Select an option');
    });

    it('should render with value when provided', () => {
      const testOptions: SelectOption[] = [
        { value: 'test-value', label: 'Test Value' },
        { value: 'other-value', label: 'Other Value' },
      ];

      render(<SelectField {...defaultProps} value="test-value" options={testOptions} />);

      expect(screen.getByTestId('select-field')).toHaveValue('test-value');
    });

    it('should render with className when provided', () => {
      render(<SelectField {...defaultProps} className="custom-class" />);

      expect(screen.getByTestId('select-field')).toHaveClass('custom-class');
    });
  });

  describe('Options Rendering', () => {
    it('should render options from options prop', () => {
      render(<SelectField {...defaultProps} options={mockOptions} />);

      const select = screen.getByTestId('select-field');
      const options = select.querySelectorAll('option');

      expect(options).toHaveLength(3);
      expect(options[0]).toHaveValue('option1');
      expect(options[0]).toHaveTextContent('Option 1');
      expect(options[1]).toHaveValue('option2');
      expect(options[1]).toHaveTextContent('Option 2');
      expect(options[2]).toHaveValue('option3');
      expect(options[2]).toHaveTextContent('Option 3');
    });

    it('should render children instead of options when both are provided', () => {
      render(
        <SelectField {...defaultProps} options={mockOptions}>
          <option value="child1">Child Option 1</option>
          <option value="child2">Child Option 2</option>
        </SelectField>,
      );

      const select = screen.getByTestId('select-field');
      const options = select.querySelectorAll('option');

      expect(options).toHaveLength(2);
      expect(options[0]).toHaveValue('child1');
      expect(options[0]).toHaveTextContent('Child Option 1');
      expect(options[1]).toHaveValue('child2');
      expect(options[1]).toHaveTextContent('Child Option 2');
    });

    it('should render empty select when no options or children provided', () => {
      render(<SelectField {...defaultProps} />);

      const select = screen.getByTestId('select-field');
      const options = select.querySelectorAll('option');

      expect(options).toHaveLength(0);
    });
  });

  describe('Loading State', () => {
    it('should render skeleton when isLoading is true', () => {
      render(<SelectField {...defaultProps} isLoading />);

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('select-field')).not.toBeInTheDocument();
    });

    it('should render skeleton with className when isLoading is true', () => {
      render(<SelectField {...defaultProps} isLoading className="loading-class" />);

      expect(screen.getByTestId('skeleton')).toHaveClass('loading-class');
    });

    it('should render select field when isLoading is false', () => {
      render(<SelectField {...defaultProps} isLoading={false} />);

      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(screen.getByTestId('select-field')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when error is provided', () => {
      render(<SelectField {...defaultProps} error="This field is required" />);

      const errorText = screen.getByTestId('text-helper');
      expect(errorText).toBeInTheDocument();
      expect(errorText).toHaveTextContent('This field is required');
      expect(errorText).toHaveAttribute('data-preset', 'caption');
    });

    it('should set hasError on select when error is provided', () => {
      render(<SelectField {...defaultProps} error="This field is required" />);

      expect(screen.getByTestId('select-field')).toHaveAttribute('data-has-error', 'true');
    });

    it('should not display error message when error is not provided', () => {
      render(<SelectField {...defaultProps} />);

      expect(screen.queryByTestId('text-helper')).not.toBeInTheDocument();
    });

    it('should not set hasError on select when error is not provided', () => {
      render(<SelectField {...defaultProps} />);

      expect(screen.getByTestId('select-field')).toHaveAttribute('data-has-error', 'false');
    });

    it('should not set hasError on select when error is empty string', () => {
      render(<SelectField {...defaultProps} error="" />);

      expect(screen.getByTestId('select-field')).toHaveAttribute('data-has-error', 'false');
      expect(screen.queryByTestId('text-helper')).not.toBeInTheDocument();
    });
  });

  describe('Event Handling', () => {
    it('should call onOdsChange when select value changes', () => {
      const mockOnOdsChange = vi.fn();
      render(<SelectField {...defaultProps} options={mockOptions} onOdsChange={mockOnOdsChange} />);

      const select = screen.getByTestId('select-field');
      fireEvent.change(select, { target: { value: 'option2' } });

      expect(mockOnOdsChange).toHaveBeenCalledTimes(1);
      expect(mockOnOdsChange).toHaveBeenCalledWith({ detail: { value: 'option2' } });
    });

    it('should not throw error when onOdsChange is not provided', () => {
      render(<SelectField {...defaultProps} options={mockOptions} />);

      const select = screen.getByTestId('select-field');

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

      // Should have label, select, and error in that order
      expect(children).toHaveLength(3);
      expect(children[0]).toHaveAttribute('data-testid', 'text-label');
      expect(children[1]).toHaveAttribute('data-testid', 'select-field');
      expect(children[2]).toHaveAttribute('data-testid', 'text-helper');
    });
  });

  describe('Accessibility', () => {
    it('should have proper name attribute for form association', () => {
      render(<SelectField {...defaultProps} name="accessibility-test" />);

      expect(screen.getByTestId('select-field')).toHaveAttribute('name', 'accessibility-test');
    });

    it('should maintain select element semantics', () => {
      render(<SelectField {...defaultProps} options={mockOptions} />);

      const select = screen.getByTestId('select-field');
      expect(select.tagName).toBe('SELECT');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty options array', () => {
      render(<SelectField {...defaultProps} options={[]} />);

      const select = screen.getByTestId('select-field');
      const options = select.querySelectorAll('option');

      expect(options).toHaveLength(0);
    });

    it('should handle options with special characters in labels', () => {
      const specialOptions: SelectOption[] = [
        { value: 'special1', label: 'Option with "quotes"' },
        { value: 'special2', label: 'Option with <tags>' },
        { value: 'special3', label: 'Option with & symbols' },
      ];

      render(<SelectField {...defaultProps} options={specialOptions} />);

      const select = screen.getByTestId('select-field');
      const options = select.querySelectorAll('option');

      expect(options[0]).toHaveTextContent('Option with "quotes"');
      expect(options[1]).toHaveTextContent('Option with <tags>');
      expect(options[2]).toHaveTextContent('Option with & symbols');
    });
  });
});
