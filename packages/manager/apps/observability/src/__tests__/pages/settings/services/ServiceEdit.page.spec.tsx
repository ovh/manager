import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ServiceEditPage from '@/pages/settings/services/edit/ServiceEdit.page';

const {
  mockNavigate,
  mockUseObservabilityServiceContext,
  mockEditService,
  mockUseEditObservabilityService,
  mockUseServiceFormSchema,
} = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockUseObservabilityServiceContext: vi.fn(),
  mockEditService: vi.fn(),
  mockUseEditObservabilityService: vi.fn(),
  mockUseServiceFormSchema: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const mockAddError = vi.fn();
const mockAddSuccess = vi.fn();

vi.mock('@ovhcloud/ods-react', () => ({
  BUTTON_COLOR: { primary: 'primary' },
  BUTTON_VARIANT: { ghost: 'ghost', default: 'default' },
  MODAL_COLOR: { information: 'information' },
  TEXT_PRESET: { heading4: 'heading4', paragraph: 'paragraph', label: 'label' },
  Modal: ({ children, open }: { children: React.ReactNode; open: boolean }) => (
    <div data-testid="modal" data-open={open}>
      {children}
    </div>
  ),
  ModalContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-content">{children}</div>
  ),
  ModalBody: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-body">{children}</div>
  ),
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  FormField: ({
    children,
    invalid,
  }: {
    children: React.ReactNode;
    invalid?: boolean;
    className?: string;
  }) => (
    <div data-testid="form-field" data-invalid={invalid}>
      {children}
    </div>
  ),
  FormFieldLabel: ({ children }: { children: React.ReactNode }) => <label>{children}</label>,
  FormFieldError: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-field-error">{children}</div>
  ),
  Input: ({
    id,
    disabled,
    invalid,
    placeholder,
    ...props
  }: {
    id: string;
    disabled?: boolean;
    invalid?: boolean;
    placeholder?: string;
    name?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  }) => (
    <input
      data-testid="display-name-input"
      id={id}
      disabled={disabled}
      data-invalid={invalid}
      placeholder={placeholder}
      {...props}
    />
  ),
  Button: ({
    children,
    onClick,
    type,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    type?: string;
    'data-testid'?: string;
  }) => (
    <button data-testid={testId} onClick={onClick} type={type as 'button' | 'submit'}>
      {children}
    </button>
  ),
}));

vi.mock('@ovh-ux/muk', () => ({
  Button: ({
    children,
    onClick,
    type,
    disabled,
    loading,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    type?: string;
    disabled?: boolean;
    loading?: boolean;
    'data-testid'?: string;
  }) => (
    <button
      data-testid={testId}
      onClick={onClick}
      type={type as 'button' | 'submit'}
      disabled={disabled}
      data-loading={loading}
    >
      {children}
    </button>
  ),
  useNotifications: () => ({
    addError: mockAddError,
    addSuccess: mockAddSuccess,
  }),
}));

vi.mock('@/contexts/ObservabilityService.context', () => ({
  useObservabilityServiceContext: mockUseObservabilityServiceContext,
}));

vi.mock('@/data/hooks/services/useEditObservabilityService.hook', () => ({
  useEditObservabilityService: mockUseEditObservabilityService,
}));

vi.mock('@/hooks/form/useServiceFormSchema.hook', () => ({
  useServiceFormSchema: mockUseServiceFormSchema,
}));

vi.mock('@/components/error/ErrorMessage.component', () => ({
  default: ({ error }: { error: Error }) => (
    <span data-testid="error-message">{error.message}</span>
  ),
}));

vi.mock('@/utils/iam.constants', () => ({
  IAM_ACTIONS: { EDIT_SERVICE: ['edit-service-action'] },
}));

describe('ServiceEditPage', () => {
  const mockRegister = vi.fn((name: string) => ({
    name,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  }));
  const mockHandleSubmit = vi.fn(
    (callback: (data: { displayName: string }) => void) => (e: React.FormEvent) => {
      e.preventDefault();
      callback({ displayName: 'New Service Name' });
    },
  );

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseObservabilityServiceContext.mockReturnValue({
      selectedService: {
        id: 'service-123',
        currentState: { displayName: 'My Service' },
        iam: { urn: 'urn:service:123' },
      },
    });

    mockUseEditObservabilityService.mockReturnValue({
      mutate: mockEditService,
      isPending: false,
    });

    mockUseServiceFormSchema.mockReturnValue({
      form: {
        register: mockRegister,
        handleSubmit: mockHandleSubmit,
        formState: {
          errors: {},
          isDirty: true,
          isValid: true,
        },
      },
    });
  });

  describe('Rendering', () => {
    it.each([
      { testId: 'modal', description: 'edit modal' },
      { testId: 'display-name-input', description: 'display name input' },
      { testId: 'cancel-button', description: 'cancel button' },
      { testId: 'confirm-button', description: 'confirm button' },
    ])('should render the $description', ({ testId }) => {
      render(<ServiceEditPage />);

      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });

    it('should display modal title', () => {
      render(<ServiceEditPage />);

      expect(screen.getByText('services:edit.title')).toBeInTheDocument();
    });

    it('should display form field label', () => {
      render(<ServiceEditPage />);

      expect(screen.getByText('dashboard:name', { exact: false })).toBeInTheDocument();
    });

    it('should render modal with open state', () => {
      render(<ServiceEditPage />);

      expect(screen.getByTestId('modal')).toHaveAttribute('data-open', 'true');
    });
  });

  describe('Form Initialization', () => {
    it.each([
      {
        name: 'current display name when available',
        selectedService: {
          id: 'service-123',
          currentState: { displayName: 'My Service' },
          iam: { urn: 'urn:service:123' },
        },
        expectedValue: 'My Service',
      },
      {
        name: 'service id when displayName is null',
        selectedService: {
          id: 'service-123',
          currentState: { displayName: null },
          iam: { urn: 'urn:service:123' },
        },
        expectedValue: 'service-123',
      },
      {
        name: 'empty string when no service is selected',
        selectedService: undefined,
        expectedValue: '',
      },
    ])('should initialize form with $name', ({ selectedService, expectedValue }) => {
      mockUseObservabilityServiceContext.mockReturnValue({ selectedService });

      render(<ServiceEditPage />);

      expect(mockUseServiceFormSchema).toHaveBeenCalledWith(expectedValue);
    });
  });

  describe('Form Validation', () => {
    it('should show validation error and mark fields as invalid when displayName has error', () => {
      mockUseServiceFormSchema.mockReturnValue({
        form: {
          register: mockRegister,
          handleSubmit: mockHandleSubmit,
          formState: {
            errors: { displayName: { message: 'Name is required' } },
            isDirty: true,
            isValid: false,
          },
        },
      });

      render(<ServiceEditPage />);

      expect(screen.getByTestId('form-field-error')).toBeInTheDocument();
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByTestId('form-field')).toHaveAttribute('data-invalid', 'true');
      expect(screen.getByTestId('display-name-input')).toHaveAttribute('data-invalid', 'true');
    });
  });

  describe('Submit Button State', () => {
    it.each([
      {
        name: 'form is not dirty',
        formState: { errors: {}, isDirty: false, isValid: true },
        isPending: false,
      },
      {
        name: 'form is not valid',
        formState: { errors: { displayName: { message: 'Error' } }, isDirty: true, isValid: false },
        isPending: false,
      },
      {
        name: 'mutation is pending',
        formState: { errors: {}, isDirty: true, isValid: true },
        isPending: true,
      },
    ])('should disable submit button when $name', ({ formState, isPending }) => {
      mockUseServiceFormSchema.mockReturnValue({
        form: {
          register: mockRegister,
          handleSubmit: mockHandleSubmit,
          formState,
        },
      });
      mockUseEditObservabilityService.mockReturnValue({
        mutate: mockEditService,
        isPending,
      });

      render(<ServiceEditPage />);

      expect(screen.getByTestId('confirm-button')).toBeDisabled();
    });

    it('should enable submit button when form is dirty and valid', () => {
      render(<ServiceEditPage />);

      expect(screen.getByTestId('confirm-button')).not.toBeDisabled();
    });

    it('should show loading state on submit button when pending', () => {
      mockUseEditObservabilityService.mockReturnValue({
        mutate: mockEditService,
        isPending: true,
      });

      render(<ServiceEditPage />);

      expect(screen.getByTestId('confirm-button')).toHaveAttribute('data-loading', 'true');
    });
  });

  describe('Input State', () => {
    it.each([
      { isPending: true, shouldBeDisabled: true },
      { isPending: false, shouldBeDisabled: false },
    ])(
      'should have disabled=$shouldBeDisabled when isPending=$isPending',
      ({ isPending, shouldBeDisabled }) => {
        mockUseEditObservabilityService.mockReturnValue({
          mutate: mockEditService,
          isPending,
        });

        render(<ServiceEditPage />);

        if (shouldBeDisabled) {
          expect(screen.getByTestId('display-name-input')).toBeDisabled();
        } else {
          expect(screen.getByTestId('display-name-input')).not.toBeDisabled();
        }
      },
    );
  });

  describe('User Actions', () => {
    it('should navigate back when cancel button is clicked', () => {
      render(<ServiceEditPage />);

      fireEvent.click(screen.getByTestId('cancel-button'));

      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it('should call editService with correct payload when form is submitted', async () => {
      render(<ServiceEditPage />);

      const form = screen.getByTestId('confirm-button').closest('form');
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(mockEditService).toHaveBeenCalledWith({
          resourceName: 'service-123',
          targetSpec: { displayName: 'New Service Name' },
        });
      });
    });
  });

  describe('Mutation Callbacks', () => {
    it('should call addSuccess and navigate back on mutation success', async () => {
      let capturedOnSuccess:
        | ((data: unknown, variables: { targetSpec: { displayName: string } }) => void)
        | undefined;

      mockUseEditObservabilityService.mockImplementation(
        (options: {
          onSuccess?: (data: unknown, variables: { targetSpec: { displayName: string } }) => void;
        }) => {
          capturedOnSuccess = options?.onSuccess;
          return {
            mutate: mockEditService,
            isPending: false,
          };
        },
      );

      render(<ServiceEditPage />);

      capturedOnSuccess?.(
        { id: 'service-123', currentState: { displayName: 'Updated Name' } },
        { targetSpec: { displayName: 'Updated Name' } },
      );

      await waitFor(() => {
        expect(mockAddSuccess).toHaveBeenCalledWith('services:edit.success');
        expect(mockNavigate).toHaveBeenCalledWith(-1);
      });
    });

    it('should call addError on mutation error', async () => {
      let capturedOnError: ((error: Error) => void) | undefined;

      mockUseEditObservabilityService.mockImplementation(
        (options: { onError?: (error: Error) => void }) => {
          capturedOnError = options?.onError;
          return {
            mutate: mockEditService,
            isPending: false,
          };
        },
      );

      render(<ServiceEditPage />);

      capturedOnError?.(new Error('Edit failed'));

      await waitFor(() => {
        expect(mockAddError).toHaveBeenCalled();
      });
    });
  });

  describe('Hook Integration', () => {
    it('should call useEditObservabilityService with callbacks', () => {
      render(<ServiceEditPage />);

      expect(mockUseEditObservabilityService).toHaveBeenCalledWith(
        expect.objectContaining({
          onSuccess: expect.any(Function) as unknown,
          onError: expect.any(Function) as unknown,
        }),
      );
    });

    it('should call useObservabilityServiceContext', () => {
      render(<ServiceEditPage />);

      expect(mockUseObservabilityServiceContext).toHaveBeenCalled();
    });
  });
});
