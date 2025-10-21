import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { TextField } from '@/components/form/text-field/TextField.component';
import { TextFieldProps } from '@/components/form/text-field/TextField.props';

// Mock ODS components
vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsFormField: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="form-field" className={className}>
      {children}
    </div>
  ),
  OdsInput: React.forwardRef<
    HTMLInputElement,
    {
      id: string;
      name?: string;
      type?: string;
      value?: string;
      placeholder?: string;
      isRequired?: boolean;
      onOdsChange?: (event: { detail: { value: string } }) => void;
      onOdsBlur?: () => void;
      hasError?: boolean;
    }
  >(({ id, name, type, value, placeholder, isRequired, onOdsChange, onOdsBlur, hasError }, ref) => {
    const [inputValue, setInputValue] = React.useState(value || '');

    React.useEffect(() => {
      setInputValue(value || '');
    }, [value]);

    return (
      <input
        ref={ref}
        data-testid="input-field"
        id={id}
        name={name}
        type={type}
        value={inputValue}
        placeholder={placeholder}
        required={isRequired}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setInputValue(e.target.value);
          onOdsChange?.({ detail: { value: e.target.value } });
        }}
        onBlur={onOdsBlur}
        data-has-error={hasError}
      />
    );
  }),
  OdsTextarea: React.forwardRef<
    HTMLTextAreaElement,
    {
      id: string;
      name?: string;
      value?: string;
      placeholder?: string;
      rows?: number;
      isRequired?: boolean;
      onOdsChange?: (event: { detail: { value: string } }) => void;
      onOdsBlur?: () => void;
      hasError?: boolean;
    }
  >(({ id, name, value, placeholder, rows, isRequired, onOdsChange, onOdsBlur, hasError }, ref) => {
    const [textareaValue, setTextareaValue] = React.useState(value || '');

    React.useEffect(() => {
      setTextareaValue(value || '');
    }, [value]);

    return (
      <textarea
        ref={ref}
        data-testid="textarea-field"
        id={id}
        name={name}
        value={textareaValue}
        placeholder={placeholder}
        rows={rows}
        required={isRequired}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setTextareaValue(e.target.value);
          onOdsChange?.({ detail: { value: e.target.value } });
        }}
        onBlur={onOdsBlur}
        data-has-error={hasError}
      />
    );
  }),
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

describe('TextField', () => {
  const defaultProps: TextFieldProps = {
    id: 'test-field',
    label: 'Test Label',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render basic text field with required props only', () => {
      render(<TextField {...defaultProps} />);

      expect(screen.getByTestId('form-field')).toBeInTheDocument();
      expect(screen.getByTestId('input-field')).toBeInTheDocument();
      expect(screen.getByTestId('input-field')).toHaveAttribute('id', 'test-field');
      expect(screen.getByTestId('input-field')).toHaveAttribute('name', 'test-field');
      expect(screen.getByTestId('input-field')).toHaveAttribute('type', 'text');
    });

    it('should render with label', () => {
      render(<TextField {...defaultProps} />);

      const label = screen.getByLabelText('Test Label');
      expect(label).toBeInTheDocument();

      const labelText = screen.getByTestId('text-label');
      expect(labelText).toBeInTheDocument();
      expect(labelText).toHaveTextContent('Test Label');
      expect(labelText).toHaveAttribute('data-preset', 'paragraph');
    });

    it('should render with custom name when provided', () => {
      render(<TextField {...defaultProps} name="custom-name" />);

      expect(screen.getByTestId('input-field')).toHaveAttribute('name', 'custom-name');
    });

    it('should render with placeholder when provided', () => {
      render(<TextField {...defaultProps} placeholder="Enter text here" />);

      expect(screen.getByTestId('input-field')).toHaveAttribute('placeholder', 'Enter text here');
    });

    it('should render with value when provided', () => {
      render(<TextField {...defaultProps} value="test value" />);

      expect(screen.getByTestId('input-field')).toHaveValue('test value');
    });

    it('should render with custom className when provided', () => {
      render(<TextField {...defaultProps} className="custom-class" />);

      expect(screen.getByTestId('form-field')).toHaveClass('custom-class');
    });

    it('should render with default className when not provided', () => {
      render(<TextField {...defaultProps} />);

      expect(screen.getByTestId('form-field')).toHaveClass('my-4', 'w-full');
    });

    it('should render as required when isRequired is true', () => {
      render(<TextField {...defaultProps} isRequired />);

      expect(screen.getByTestId('input-field')).toBeRequired();
    });

    it('should render as not required when isRequired is false', () => {
      render(<TextField {...defaultProps} isRequired={false} />);

      expect(screen.getByTestId('input-field')).not.toBeRequired();
    });
  });

  describe('Input Types', () => {
    it('should render input field with text type by default', () => {
      render(<TextField {...defaultProps} />);

      expect(screen.getByTestId('input-field')).toHaveAttribute('type', 'text');
      expect(screen.queryByTestId('textarea-field')).not.toBeInTheDocument();
    });

    it('should render input field with email type', () => {
      render(<TextField {...defaultProps} type="email" />);

      expect(screen.getByTestId('input-field')).toHaveAttribute('type', 'email');
      expect(screen.queryByTestId('textarea-field')).not.toBeInTheDocument();
    });

    it('should render input field with password type', () => {
      render(<TextField {...defaultProps} type="password" />);

      expect(screen.getByTestId('input-field')).toHaveAttribute('type', 'password');
      expect(screen.queryByTestId('textarea-field')).not.toBeInTheDocument();
    });

    it('should render textarea when type is textarea', () => {
      render(<TextField {...defaultProps} type="textarea" />);

      expect(screen.getByTestId('textarea-field')).toBeInTheDocument();
      expect(screen.queryByTestId('input-field')).not.toBeInTheDocument();
    });

    it('should render textarea with custom rows', () => {
      render(<TextField {...defaultProps} type="textarea" rows={6} />);

      expect(screen.getByTestId('textarea-field')).toHaveAttribute('rows', '6');
    });

    it('should render textarea with default rows when not provided', () => {
      render(<TextField {...defaultProps} type="textarea" />);

      expect(screen.getByTestId('textarea-field')).toHaveAttribute('rows', '4');
    });
  });

  describe('Error Handling', () => {
    it('should display error message when error is provided', () => {
      render(<TextField {...defaultProps} error="This field is required" />);

      const errorText = screen.getByTestId('text-helper');
      expect(errorText).toBeInTheDocument();
      expect(errorText).toHaveTextContent('This field is required');
      expect(errorText).toHaveAttribute('data-preset', 'caption');
    });

    it('should set hasError on input when error is provided', () => {
      render(<TextField {...defaultProps} error="This field is required" />);

      expect(screen.getByTestId('input-field')).toHaveAttribute('data-has-error', 'true');
    });

    it('should set hasError on textarea when error is provided', () => {
      render(<TextField {...defaultProps} type="textarea" error="This field is required" />);

      expect(screen.getByTestId('textarea-field')).toHaveAttribute('data-has-error', 'true');
    });

    it('should not display error message when error is not provided', () => {
      render(<TextField {...defaultProps} />);

      expect(screen.queryByTestId('text-helper')).not.toBeInTheDocument();
    });

    it('should not set hasError when error is not provided', () => {
      render(<TextField {...defaultProps} />);

      expect(screen.getByTestId('input-field')).toHaveAttribute('data-has-error', 'false');
    });

    it('should not display error message when error is empty string', () => {
      render(<TextField {...defaultProps} error="" />);

      expect(screen.queryByTestId('text-helper')).not.toBeInTheDocument();
    });

    it('should not set hasError when error is empty string', () => {
      render(<TextField {...defaultProps} error="" />);

      expect(screen.getByTestId('input-field')).toHaveAttribute('data-has-error', 'false');
    });
  });

  describe('Event Handling', () => {
    it('should call onChange when input value changes', () => {
      const mockOnChange = vi.fn();
      render(<TextField {...defaultProps} onChange={mockOnChange} />);

      const input = screen.getByTestId('input-field');
      fireEvent.change(input, { target: { value: 'new value' } });

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('new value');
    });

    it('should call onChange when textarea value changes', () => {
      const mockOnChange = vi.fn();
      render(<TextField {...defaultProps} type="textarea" onChange={mockOnChange} />);

      const textarea = screen.getByTestId('textarea-field');
      fireEvent.change(textarea, { target: { value: 'new textarea value' } });

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('new textarea value');
    });

    it('should call onBlur when input loses focus', () => {
      const mockOnBlur = vi.fn();
      render(<TextField {...defaultProps} onBlur={mockOnBlur} />);

      const input = screen.getByTestId('input-field');
      fireEvent.blur(input);

      expect(mockOnBlur).toHaveBeenCalledTimes(1);
    });

    it('should call onBlur when textarea loses focus', () => {
      const mockOnBlur = vi.fn();
      render(<TextField {...defaultProps} type="textarea" onBlur={mockOnBlur} />);

      const textarea = screen.getByTestId('textarea-field');
      fireEvent.blur(textarea);

      expect(mockOnBlur).toHaveBeenCalledTimes(1);
    });

    it('should not throw error when onChange is not provided', () => {
      render(<TextField {...defaultProps} />);

      const input = screen.getByTestId('input-field');

      expect(() => {
        fireEvent.change(input, { target: { value: 'test' } });
      }).not.toThrow();
    });

    it('should not throw error when onBlur is not provided', () => {
      render(<TextField {...defaultProps} />);

      const input = screen.getByTestId('input-field');

      expect(() => {
        fireEvent.blur(input);
      }).not.toThrow();
    });
  });

  describe('Form Field Structure', () => {
    it('should render all components in correct order when all props provided', () => {
      const { container } = render(
        <TextField {...defaultProps} value="test value" error="Test Error" />,
      );

      const formField = container.querySelector('[data-testid="form-field"]');
      const children = Array.from(formField?.children || []);

      // Should have label, input, and error in that order
      expect(children).toHaveLength(3);
      expect(children[0]?.tagName).toBe('LABEL');
      expect(children[1]).toHaveAttribute('data-testid', 'input-field');
      expect(children[2]).toHaveAttribute('data-testid', 'text-helper');
    });

    it('should render textarea structure correctly', () => {
      const { container } = render(
        <TextField {...defaultProps} type="textarea" value="test value" error="Test Error" />,
      );

      const formField = container.querySelector('[data-testid="form-field"]');
      const children = Array.from(formField?.children || []);

      // Should have label, textarea, and error in that order
      expect(children).toHaveLength(3);
      expect(children[0]?.tagName).toBe('LABEL');
      expect(children[1]).toHaveAttribute('data-testid', 'textarea-field');
      expect(children[2]).toHaveAttribute('data-testid', 'text-helper');
    });
  });

  describe('Accessibility', () => {
    it('should have proper label association with input', () => {
      render(<TextField {...defaultProps} />);

      const label = screen.getByLabelText('Test Label');
      expect(label).toHaveAttribute('id', 'test-field');
    });

    it('should have proper label association with textarea', () => {
      render(<TextField {...defaultProps} type="textarea" />);

      const textarea = screen.getByLabelText('Test Label');
      expect(textarea).toHaveAttribute('id', 'test-field');
    });

    it('should maintain input element semantics', () => {
      render(<TextField {...defaultProps} />);

      const input = screen.getByTestId('input-field');
      expect(input.tagName).toBe('INPUT');
    });

    it('should maintain textarea element semantics', () => {
      render(<TextField {...defaultProps} type="textarea" />);

      const textarea = screen.getByTestId('textarea-field');
      expect(textarea.tagName).toBe('TEXTAREA');
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to input element', () => {
      const ref = React.createRef<HTMLOdsInputElement>();
      render(<TextField {...defaultProps} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.id).toBe('test-field');
    });

    it('should forward ref to textarea element', () => {
      const ref = React.createRef<HTMLOdsTextareaElement>();
      render(<TextField {...defaultProps} type="textarea" ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
      expect(ref.current?.id).toBe('test-field');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined value gracefully', () => {
      render(<TextField {...defaultProps} value={undefined} />);

      expect(screen.getByTestId('input-field')).toHaveValue('');
    });

    it('should handle empty string value', () => {
      render(<TextField {...defaultProps} value="" />);

      expect(screen.getByTestId('input-field')).toHaveValue('');
    });

    it('should handle special characters in value', () => {
      const specialValue = 'Value with "quotes" & <tags>';
      render(<TextField {...defaultProps} value={specialValue} />);

      expect(screen.getByTestId('input-field')).toHaveValue(specialValue);
    });

    it('should handle special characters in placeholder', () => {
      const specialPlaceholder = 'Placeholder with "quotes" & <tags>';
      render(<TextField {...defaultProps} placeholder={specialPlaceholder} />);

      expect(screen.getByTestId('input-field')).toHaveAttribute('placeholder', specialPlaceholder);
    });

    it('should handle very long text in textarea', () => {
      const longText = 'A'.repeat(1000);
      render(<TextField {...defaultProps} type="textarea" value={longText} />);

      expect(screen.getByTestId('textarea-field')).toHaveValue(longText);
    });
  });

  describe('Component Display Name', () => {
    it('should have correct display name', () => {
      expect(TextField.displayName).toBe('TextField');
    });
  });
});
