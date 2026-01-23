import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { vi } from 'vitest';

import { InformationForm } from '@/components/form/information-form/InformationForm.component';
import { InformationFormProps } from '@/components/form/information-form/InformationForm.props';
import { TenantFormData } from '@/types/tenants.type';

// Mock the TextField component
vi.mock('@/components/form/text-field/TextField.component', () => ({
  TextField: vi
    .fn()
    .mockImplementation(
      ({
        id,
        label,
        placeholder,
        type = 'text',
        value = '',
        onChange,
        onBlur,
        error,
        isRequired = false,
      }: {
        id: string;
        label: string;
        placeholder?: string;
        type?: string;
        value?: string;
        onChange?: (value: string) => void;
        onBlur?: () => void;
        error?: string;
        isRequired?: boolean;
      }) => (
        <div data-testid={`text-field-${id}`}>
          <label htmlFor={id}>{label}</label>
          {type === 'textarea' ? (
            <textarea
              id={id}
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              onBlur={onBlur}
              required={isRequired}
              data-testid={`${id}-input`}
            />
          ) : (
            <input
              id={id}
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              onBlur={onBlur}
              required={isRequired}
              data-testid={`${id}-input`}
            />
          )}
          {error && <span data-testid={`${id}-error`}>{error}</span>}
        </div>
      ),
    ),
}));

// Mock ODS components
vi.mock('@ovh-ux/muk', () => ({
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  TEXT_PRESET: {
    heading4: 'heading4',
  },
}));

// Mock translation namespaces
vi.mock('@ovh-ux/manager-common-translations', () => ({
  NAMESPACES: {
    DASHBOARD: 'dashboard',
  },
}));

// Test wrapper component that provides form context
interface TestWrapperProps {
  children: React.ReactNode;
  defaultValues?: Partial<TenantFormData>;
  onSubmit?: (data: TenantFormData) => void;
  withErrors?: { title?: string; description?: string };
}

const TestWrapper: React.FC<TestWrapperProps> = ({
  children,
  defaultValues = {},
  onSubmit = vi.fn(),
  withErrors,
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const methods = useForm<TenantFormData>({
    defaultValues: {
      title: '',
      description: '',
      infrastructureId: '',
      retentionDuration: '',
      maxSeries: null,
      ...defaultValues,
    },
  });

  // Set errors if provided
  React.useEffect(() => {
    if (withErrors?.title) {
      methods.setError('title', { message: withErrors.title });
    }
    if (withErrors?.description) {
      methods.setError('description', { message: withErrors.description });
    }
  }, [methods, withErrors]);

  const handleSubmit = (data: TenantFormData) => {
    onSubmit(data);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void methods.handleSubmit(handleSubmit)(e);
          }}
        >
          {children}
        </form>
      </FormProvider>
    </QueryClientProvider>
  );
};

describe('InformationForm', () => {
  const defaultProps: InformationFormProps = {
    title: 'Test Form Title',
    namePlaceholder: 'Enter name here',
    descriptionPlaceholder: 'Enter description here',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the form title and fields correctly', () => {
      render(
        <TestWrapper>
          <InformationForm {...defaultProps} />
        </TestWrapper>,
      );

      expect(screen.getByText('Test Form Title')).toBeInTheDocument();

      const titleInput = screen.getByTestId('title-input');
      expect(titleInput).toHaveAttribute('placeholder', 'Enter name here');
      expect(titleInput).toHaveAttribute('required');
      expect(titleInput).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText('dashboard:name - shared:mandatory')).toBeInTheDocument();

      const descriptionInput = screen.getByTestId('description-input');
      expect(descriptionInput).toHaveAttribute('placeholder', 'Enter description here');
      expect(descriptionInput).toHaveAttribute('required');
      expect(screen.getByLabelText('dashboard:description - shared:mandatory')).toBeInTheDocument();
    });

    it('should render without description placeholder when not provided', () => {
      const propsWithoutDescriptionPlaceholder = {
        ...defaultProps,
        descriptionPlaceholder: undefined,
      };

      render(
        <TestWrapper>
          <InformationForm {...propsWithoutDescriptionPlaceholder} />
        </TestWrapper>,
      );

      const descriptionInput = screen.getByTestId('description-input');
      expect(descriptionInput).not.toHaveAttribute('placeholder');
    });
  });

  describe('Form Integration', () => {
    it('should display default values and handle changes', () => {
      const defaultValues = {
        title: 'Default Title',
        description: 'Default Description',
      };

      render(
        <TestWrapper defaultValues={defaultValues}>
          <InformationForm {...defaultProps} />
        </TestWrapper>,
      );

      const titleInput = screen.getByTestId('title-input');
      const descriptionInput = screen.getByTestId('description-input');

      expect(titleInput).toHaveValue('Default Title');
      expect(descriptionInput).toHaveValue('Default Description');

      fireEvent.change(titleInput, { target: { value: 'New Title' } });
      expect(titleInput).toHaveValue('New Title');

      fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
      expect(descriptionInput).toHaveValue('New Description');
    });

    it('should handle field blur events', () => {
      render(
        <TestWrapper>
          <InformationForm {...defaultProps} />
        </TestWrapper>,
      );

      const titleInput = screen.getByTestId('title-input');
      const descriptionInput = screen.getByTestId('description-input');

      fireEvent.blur(titleInput);
      fireEvent.blur(descriptionInput);

      expect(titleInput).toBeInTheDocument();
      expect(descriptionInput).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display field errors when present', () => {
      render(
        <TestWrapper
          withErrors={{ title: 'Title is required', description: 'Description is required' }}
        >
          <InformationForm {...defaultProps} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('title-error')).toHaveTextContent('Title is required');
      expect(screen.getByTestId('description-error')).toHaveTextContent('Description is required');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form field associations and required attributes', () => {
      render(
        <TestWrapper>
          <InformationForm {...defaultProps} />
        </TestWrapper>,
      );

      const titleInput = screen.getByTestId('title-input');
      const descriptionInput = screen.getByTestId('description-input');

      expect(titleInput).toHaveAttribute('id', 'title');
      expect(descriptionInput).toHaveAttribute('id', 'description');
      expect(screen.getByLabelText('dashboard:name - shared:mandatory')).toBe(titleInput);
      expect(screen.getByLabelText('dashboard:description - shared:mandatory')).toBe(
        descriptionInput,
      );
      expect(titleInput).toHaveAttribute('required');
      expect(descriptionInput).toHaveAttribute('required');
    });
  });

  describe('Component Structure', () => {
    it('should render with correct field types and layout', () => {
      render(
        <TestWrapper>
          <InformationForm {...defaultProps} />
        </TestWrapper>,
      );

      const titleInput = screen.getByTestId('title-input');
      const descriptionInput = screen.getByTestId('description-input');

      expect(titleInput).toHaveAttribute('type', 'text');
      expect(descriptionInput.tagName).toBe('TEXTAREA');
    });
  });
});
