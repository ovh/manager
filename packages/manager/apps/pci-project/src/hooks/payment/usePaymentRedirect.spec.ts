import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import { usePaymentRedirect } from './usePaymentRedirect';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useSearchParams: vi.fn(),
}));

describe('usePaymentRedirect', () => {
  const mockUseSearchParams = vi.mocked(useSearchParams);
  const mockOnPaymentError = vi.fn();
  const mockOnPaymentSuccess = vi.fn();
  const mockGet = vi.fn();
  const mockSearchParams = ({
    get: mockGet,
  } as unknown) as URLSearchParams;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSearchParams.mockReturnValue([mockSearchParams, vi.fn()]);
  });

  it('should not call callbacks when not enabled', () => {
    mockGet.mockImplementation((key: string) => {
      if (key === 'paymentStatus') return 'success';
      if (key === 'paymentMethodId') return '123';
      return null;
    });

    renderHook(() =>
      usePaymentRedirect(false, {
        onPaymentError: mockOnPaymentError,
        onPaymentSuccess: mockOnPaymentSuccess,
      }),
    );

    expect(mockOnPaymentError).not.toHaveBeenCalled();
    expect(mockOnPaymentSuccess).not.toHaveBeenCalled();
  });

  it('should not call callbacks when no status is present', () => {
    mockGet.mockImplementation((key: string) => {
      if (key === 'paymentStatus') return null;
      if (key === 'paymentMethodId') return '123';
      return null;
    });

    renderHook(() =>
      usePaymentRedirect(true, {
        onPaymentError: mockOnPaymentError,
        onPaymentSuccess: mockOnPaymentSuccess,
      }),
    );

    expect(mockOnPaymentError).not.toHaveBeenCalled();
    expect(mockOnPaymentSuccess).not.toHaveBeenCalled();
  });

  it('should not call callbacks when no paymentMethodId is present', () => {
    mockGet.mockImplementation((key: string) => {
      if (key === 'paymentStatus') return 'success';
      if (key === 'paymentMethodId') return null;
      return null;
    });

    renderHook(() =>
      usePaymentRedirect(true, {
        onPaymentError: mockOnPaymentError,
        onPaymentSuccess: mockOnPaymentSuccess,
      }),
    );

    expect(mockOnPaymentError).not.toHaveBeenCalled();
    expect(mockOnPaymentSuccess).not.toHaveBeenCalled();
  });

  it('should call onPaymentSuccess for success status', () => {
    mockGet.mockImplementation((key: string) => {
      if (key === 'paymentStatus') return 'success';
      if (key === 'paymentMethodId') return '123';
      return null;
    });

    renderHook(() =>
      usePaymentRedirect(true, {
        onPaymentError: mockOnPaymentError,
        onPaymentSuccess: mockOnPaymentSuccess,
      }),
    );

    expect(mockOnPaymentSuccess).toHaveBeenCalledWith(123);
    expect(mockOnPaymentError).not.toHaveBeenCalled();
  });

  it('should call onPaymentSuccess for pending status', () => {
    mockGet.mockImplementation((key: string) => {
      if (key === 'paymentStatus') return 'pending';
      if (key === 'paymentMethodId') return '456';
      return null;
    });

    renderHook(() =>
      usePaymentRedirect(true, {
        onPaymentError: mockOnPaymentError,
        onPaymentSuccess: mockOnPaymentSuccess,
      }),
    );

    expect(mockOnPaymentSuccess).toHaveBeenCalledWith(456);
    expect(mockOnPaymentError).not.toHaveBeenCalled();
  });

  it('should call onPaymentError for cancel status', () => {
    mockGet.mockImplementation((key: string) => {
      if (key === 'paymentStatus') return 'cancel';
      if (key === 'paymentMethodId') return '123';
      return null;
    });

    renderHook(() =>
      usePaymentRedirect(true, {
        onPaymentError: mockOnPaymentError,
        onPaymentSuccess: mockOnPaymentSuccess,
      }),
    );

    expect(mockOnPaymentError).toHaveBeenCalled();
    expect(mockOnPaymentSuccess).not.toHaveBeenCalled();
  });

  it('should call onPaymentError for error status', () => {
    mockGet.mockImplementation((key: string) => {
      if (key === 'paymentStatus') return 'error';
      if (key === 'paymentMethodId') return '123';
      return null;
    });

    renderHook(() =>
      usePaymentRedirect(true, {
        onPaymentError: mockOnPaymentError,
        onPaymentSuccess: mockOnPaymentSuccess,
      }),
    );

    expect(mockOnPaymentError).toHaveBeenCalled();
    expect(mockOnPaymentSuccess).not.toHaveBeenCalled();
  });

  it('should call onPaymentError for failure status', () => {
    mockGet.mockImplementation((key: string) => {
      if (key === 'paymentStatus') return 'failure';
      if (key === 'paymentMethodId') return '123';
      return null;
    });

    renderHook(() =>
      usePaymentRedirect(true, {
        onPaymentError: mockOnPaymentError,
        onPaymentSuccess: mockOnPaymentSuccess,
      }),
    );

    expect(mockOnPaymentError).toHaveBeenCalled();
    expect(mockOnPaymentSuccess).not.toHaveBeenCalled();
  });

  it('should not call callbacks multiple times on re-renders', () => {
    mockGet.mockImplementation((key: string) => {
      if (key === 'paymentStatus') return 'success';
      if (key === 'paymentMethodId') return '123';
      return null;
    });

    const { rerender } = renderHook(() =>
      usePaymentRedirect(true, {
        onPaymentError: mockOnPaymentError,
        onPaymentSuccess: mockOnPaymentSuccess,
      }),
    );

    expect(mockOnPaymentSuccess).toHaveBeenCalledTimes(1);
    expect(mockOnPaymentSuccess).toHaveBeenCalledWith(123);

    // Re-render should not call the callback again
    rerender();

    expect(mockOnPaymentSuccess).toHaveBeenCalledTimes(1);
    expect(mockOnPaymentError).not.toHaveBeenCalled();
  });

  it('should handle invalid paymentMethodId gracefully', () => {
    mockGet.mockImplementation((key: string) => {
      if (key === 'paymentStatus') return 'success';
      if (key === 'paymentMethodId') return 'invalid';
      return null;
    });

    renderHook(() =>
      usePaymentRedirect(true, {
        onPaymentError: mockOnPaymentError,
        onPaymentSuccess: mockOnPaymentSuccess,
      }),
    );

    expect(mockOnPaymentSuccess).toHaveBeenCalledWith(NaN);
    expect(mockOnPaymentError).not.toHaveBeenCalled();
  });

  it('should handle unknown status gracefully', () => {
    mockGet.mockImplementation((key: string) => {
      if (key === 'paymentStatus') return 'unknown';
      if (key === 'paymentMethodId') return '123';
      return null;
    });

    renderHook(() =>
      usePaymentRedirect(true, {
        onPaymentError: mockOnPaymentError,
        onPaymentSuccess: mockOnPaymentSuccess,
      }),
    );

    expect(mockOnPaymentError).not.toHaveBeenCalled();
    expect(mockOnPaymentSuccess).not.toHaveBeenCalled();
  });
});
