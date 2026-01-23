import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ServiceDeletePage from '@/pages/settings/services/delete/ServiceDelete.page';

const {
  mockNavigate,
  mockUseObservabilityServiceContext,
  mockTerminateService,
  mockUseDeleteService,
} = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockUseObservabilityServiceContext: vi.fn(),
  mockTerminateService: vi.fn(),
  mockUseDeleteService: vi.fn(),
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

vi.mock('@ovh-ux/muk', () => ({
  DeleteModal: ({
    open,
    serviceTypeName,
    onConfirmDelete,
    onClose,
    isLoading,
  }: {
    open: boolean;
    serviceTypeName?: string;
    onConfirmDelete: () => void;
    onClose: () => void;
    isLoading: boolean;
  }) => (
    <div data-testid="delete-modal" data-open={open} data-loading={isLoading}>
      <span data-testid="service-type-name">{serviceTypeName}</span>
      <button
        data-testid="confirm-button"
        onClick={onConfirmDelete}
        disabled={isLoading}
        type="button"
      >
        Confirm
      </button>
      <button data-testid="cancel-button" onClick={onClose} type="button">
        Cancel
      </button>
    </div>
  ),
  useNotifications: () => ({
    addError: mockAddError,
    addSuccess: mockAddSuccess,
  }),
}));

vi.mock('@ovh-ux/manager-module-common-api', () => ({
  useDeleteService: mockUseDeleteService,
}));

vi.mock('@/contexts/ObservabilityService.context', () => ({
  useObservabilityServiceContext: mockUseObservabilityServiceContext,
}));

vi.mock('@/components/error/ErrorMessage.component', () => ({
  default: ({ error }: { error: Error }) => (
    <span data-testid="error-message">{error.message}</span>
  ),
}));

describe('ServiceDeletePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseObservabilityServiceContext.mockReturnValue({
      selectedService: {
        id: 'service-123',
        currentState: { displayName: 'My Service' },
      },
    });
    mockUseDeleteService.mockReturnValue({
      terminateService: mockTerminateService,
      isPending: false,
    });
  });

  describe('Rendering', () => {
    it('should render the delete modal', () => {
      render(<ServiceDeletePage />);

      expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
      expect(screen.getByTestId('delete-modal')).toHaveAttribute('data-open', 'true');
    });

    it('should display service displayName when available', () => {
      render(<ServiceDeletePage />);

      expect(screen.getByTestId('service-type-name')).toHaveTextContent('My Service');
    });

    it('should display service id when displayName is not available', () => {
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: {
          id: 'service-123',
          currentState: { displayName: null },
        },
      });

      render(<ServiceDeletePage />);

      expect(screen.getByTestId('service-type-name')).toHaveTextContent('service-123');
    });
  });

  describe('Loading State', () => {
    it('should show loading when mutation is pending', () => {
      mockUseDeleteService.mockReturnValue({
        terminateService: mockTerminateService,
        isPending: true,
      });

      render(<ServiceDeletePage />);

      expect(screen.getByTestId('delete-modal')).toHaveAttribute('data-loading', 'true');
      expect(screen.getByTestId('confirm-button')).toBeDisabled();
    });

    it('should show loading when resourceName is empty', () => {
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: undefined,
      });

      render(<ServiceDeletePage />);

      expect(screen.getByTestId('delete-modal')).toHaveAttribute('data-loading', 'true');
    });

    it('should not be loading when mutation is not pending and service is selected', () => {
      render(<ServiceDeletePage />);

      expect(screen.getByTestId('delete-modal')).toHaveAttribute('data-loading', 'false');
      expect(screen.getByTestId('confirm-button')).not.toBeDisabled();
    });
  });

  describe('User Actions', () => {
    it('should navigate back when cancel button is clicked', () => {
      render(<ServiceDeletePage />);

      fireEvent.click(screen.getByTestId('cancel-button'));

      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it('should call terminateService with correct resourceName when confirm is clicked', () => {
      render(<ServiceDeletePage />);

      fireEvent.click(screen.getByTestId('confirm-button'));

      expect(mockTerminateService).toHaveBeenCalledWith({ resourceName: 'service-123' });
    });
  });

  describe('Mutation Callbacks', () => {
    it('should call addSuccess and navigate back on mutation success', async () => {
      let capturedOnSuccess: (() => void) | undefined;

      mockUseDeleteService.mockImplementation((options: { onSuccess?: () => void }) => {
        capturedOnSuccess = options?.onSuccess;
        return {
          terminateService: mockTerminateService,
          isPending: false,
        };
      });

      render(<ServiceDeletePage />);

      capturedOnSuccess?.();

      await waitFor(() => {
        expect(mockAddSuccess).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith(-1);
      });
    });

    it('should call addError and navigate back on mutation error', async () => {
      let capturedOnError: ((err: Error) => void) | undefined;

      mockUseDeleteService.mockImplementation((options: { onError?: (err: Error) => void }) => {
        capturedOnError = options?.onError;
        return {
          terminateService: mockTerminateService,
          isPending: false,
        };
      });

      render(<ServiceDeletePage />);

      capturedOnError?.(new Error('Deletion failed'));

      await waitFor(() => {
        expect(mockAddError).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith(-1);
      });
    });
  });

  describe('Hook Integration', () => {
    it('should call useDeleteService with callbacks on mount', () => {
      render(<ServiceDeletePage />);

      expect(mockUseDeleteService).toHaveBeenCalledWith(
        expect.objectContaining({
          onSuccess: expect.any(Function) as unknown,
          onError: expect.any(Function) as unknown,
        }),
      );
    });
  });
});
