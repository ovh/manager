import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useDeleteSubscription } from '@/data/hooks/tenants/useDeleteSubscription.hook';
import DeleteTenantSubscription from '@/pages/tenants/dashboard/subscription/DeleteTenantSubscription.page';

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockNavigate = vi.fn();
const mockParams = {
  tenantId: 'tenant-123',
  resourceName: 'resource-456',
  subscriptionId: 'subscription-789',
};

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}));

const mockAddError = vi.fn();
const mockAddSuccess = vi.fn();

vi.mock('@ovh-ux/muk', () => ({
  MODAL_COLOR: {
    warning: 'warning',
    critical: 'critical',
  },
  useNotifications: () => ({
    addError: mockAddError,
    addSuccess: mockAddSuccess,
  }),
}));

vi.mock('@/utils/error.utils', () => ({
  getErrorMessage: (error: Error | null) => error?.message ?? '',
}));

const mockDeleteSubscription = vi.fn();

vi.mock('@/data/hooks/tenants/useDeleteSubscription.hook', () => ({
  useDeleteSubscription: vi.fn(),
}));

const mockUseDeleteSubscription = vi.mocked(useDeleteSubscription);

vi.mock('@/components/listing/common/confirmation-modal/ConfirmationModal.component', () => ({
  ConfirmationModal: ({
    title,
    message,
    onDismiss,
    onConfirm,
    confirmButtonLabel,
    cancelButtonLabel,
    isConfirmButtonLoading,
    error,
    type,
  }: {
    title: string;
    message: string;
    onDismiss: () => void;
    onConfirm: () => void;
    confirmButtonLabel: string;
    cancelButtonLabel: string;
    isConfirmButtonLoading: boolean;
    error?: string;
    type: string;
  }) => (
    <div data-testid="confirmation-modal" data-type={type}>
      <h2 data-testid="modal-title">{title}</h2>
      <p data-testid="modal-message">{message}</p>
      {error && <p data-testid="modal-error">{error}</p>}
      <button data-testid="cancel-button" onClick={onDismiss} type="button">
        {cancelButtonLabel}
      </button>
      <button
        data-testid="confirm-button"
        onClick={onConfirm}
        disabled={isConfirmButtonLoading}
        data-loading={isConfirmButtonLoading}
        type="button"
      >
        {confirmButtonLabel}
      </button>
    </div>
  ),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('DeleteTenantSubscription.page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDeleteSubscription.mockReturnValue({
      mutate: mockDeleteSubscription,
      isPending: false,
      error: null,
    } as unknown as ReturnType<typeof useDeleteSubscription>);
  });

  describe('Rendering', () => {
    it.each([
      {
        description: 'confirmation modal',
        testId: 'confirmation-modal',
        assertion: (el: HTMLElement) => expect(el).toBeInTheDocument(),
      },
      {
        description: 'modal with warning type',
        testId: 'confirmation-modal',
        assertion: (el: HTMLElement) => expect(el).toHaveAttribute('data-type', 'warning'),
      },
      {
        description: 'correct title',
        testId: 'modal-title',
        assertion: (el: HTMLElement) =>
          expect(el).toHaveTextContent('tenants:dashboard.subscription_listing.unsubscribe.title'),
      },
      {
        description: 'correct message',
        testId: 'modal-message',
        assertion: (el: HTMLElement) =>
          expect(el).toHaveTextContent(
            'tenants:dashboard.subscription_listing.unsubscribe.warning',
          ),
      },
      {
        description: 'confirm button with correct label',
        testId: 'confirm-button',
        assertion: (el: HTMLElement) =>
          expect(el).toHaveTextContent(
            'tenants:dashboard.subscription_listing.unsubscribe.confirm',
          ),
      },
      {
        description: 'cancel button with correct label',
        testId: 'cancel-button',
        assertion: (el: HTMLElement) =>
          expect(el).toHaveTextContent('tenants:dashboard.subscription_listing.unsubscribe.cancel'),
      },
    ])('should render $description', ({ testId, assertion }) => {
      render(<DeleteTenantSubscription />, { wrapper: createWrapper() });

      assertion(screen.getByTestId(testId));
    });
  });

  describe('Loading State', () => {
    it.each([
      {
        isPending: true,
        expectedLoading: 'true',
        expectedDisabled: true,
        description: 'loading when mutation is pending',
      },
      {
        isPending: false,
        expectedLoading: 'false',
        expectedDisabled: false,
        description: 'not loading when mutation is not pending',
      },
    ])('should be $description', ({ isPending, expectedLoading, expectedDisabled }) => {
      mockUseDeleteSubscription.mockReturnValue({
        mutate: mockDeleteSubscription,
        isPending,
        error: null,
      } as unknown as ReturnType<typeof useDeleteSubscription>);

      render(<DeleteTenantSubscription />, { wrapper: createWrapper() });

      const button = screen.getByTestId('confirm-button');
      expect(button).toHaveAttribute('data-loading', expectedLoading);
      if (expectedDisabled) {
        expect(button).toBeDisabled();
      } else {
        expect(button).not.toBeDisabled();
      }
    });
  });

  describe('Error Handling', () => {
    it.each([
      {
        error: new Error('Deletion failed'),
        expectedError: 'Deletion failed',
        shouldDisplayError: true,
        description: 'display error message when mutation fails',
      },
      {
        error: null,
        expectedError: null,
        shouldDisplayError: false,
        description: 'not display error when there is no error',
      },
    ])('should $description', ({ error, expectedError, shouldDisplayError }) => {
      mockUseDeleteSubscription.mockReturnValue({
        mutate: mockDeleteSubscription,
        isPending: false,
        error,
      } as unknown as ReturnType<typeof useDeleteSubscription>);

      render(<DeleteTenantSubscription />, { wrapper: createWrapper() });

      if (shouldDisplayError) {
        expect(screen.getByTestId('modal-error')).toHaveTextContent(expectedError!);
      } else {
        expect(screen.queryByTestId('modal-error')).not.toBeInTheDocument();
      }
    });
  });

  describe('User Actions', () => {
    it('should navigate back when cancel button is clicked', () => {
      render(<DeleteTenantSubscription />, { wrapper: createWrapper() });

      fireEvent.click(screen.getByTestId('cancel-button'));

      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it('should call deleteSubscription with correct params when confirm is clicked', () => {
      render(<DeleteTenantSubscription />, { wrapper: createWrapper() });

      fireEvent.click(screen.getByTestId('confirm-button'));

      expect(mockDeleteSubscription).toHaveBeenCalledWith({
        tenantId: 'tenant-123',
        resourceName: 'resource-456',
        subscriptionId: 'subscription-789',
      });
    });
  });

  describe('Mutation Callbacks', () => {
    it('should call addSuccess and navigate back on mutation success', async () => {
      let capturedOnSuccess: (() => void) | undefined;

      mockUseDeleteSubscription.mockImplementation((options) => {
        capturedOnSuccess = options?.onSuccess as () => void;
        return {
          mutate: mockDeleteSubscription,
          isPending: false,
          error: null,
        } as unknown as ReturnType<typeof useDeleteSubscription>;
      });

      render(<DeleteTenantSubscription />, { wrapper: createWrapper() });

      capturedOnSuccess?.();

      await waitFor(() => {
        expect(mockAddSuccess).toHaveBeenCalledWith(
          'tenants:dashboard.subscription_listing.unsubscribe.success',
        );
        expect(mockNavigate).toHaveBeenCalledWith(-1);
      });
    });

    it('should call addError on mutation error', async () => {
      let capturedOnError: ((err: Error) => void) | undefined;

      mockUseDeleteSubscription.mockImplementation((options) => {
        capturedOnError = options?.onError as ((err: Error) => void) | undefined;
        return {
          mutate: mockDeleteSubscription,
          isPending: false,
          error: null,
        } as unknown as ReturnType<typeof useDeleteSubscription>;
      });

      render(<DeleteTenantSubscription />, { wrapper: createWrapper() });

      capturedOnError?.(new Error('Network error'));

      await waitFor(() => {
        expect(mockAddError).toHaveBeenCalledWith(expect.stringContaining('error_message'));
      });
    });
  });

  describe('Hook Integration', () => {
    it('should call useDeleteSubscription with callbacks on mount', () => {
      render(<DeleteTenantSubscription />, { wrapper: createWrapper() });

      expect(mockUseDeleteSubscription).toHaveBeenCalledWith(
        expect.objectContaining({
          onSuccess: expect.any(Function) as unknown,
          onError: expect.any(Function) as unknown,
        }),
      );
    });
  });
});
