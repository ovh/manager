import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWillPayment } from './useWillPayment';
import {
  ComponentStatus,
  GlobalStateStatus,
  PaymentMethodStatus,
} from '@/types/WillPayment.type';

describe('useWillPayment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const mockEventBus = document.createElement('div');
    mockEventBus.id = 'will-payment-event-bus';
    mockEventBus.dispatchEvent = vi.fn();
    document.getElementById = vi.fn().mockReturnValue(mockEventBus);
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useWillPayment());

    expect(result.current.hasDefaultPaymentMethod).toBe(false);
    expect(result.current.isPaymentMethodSaveRequired).toBe(false);
    expect(result.current.isPaymentMethodSaved).toBe(false);
    expect(result.current.isSubmittingDisabled).toBe(true);
    expect(typeof result.current.triggerSavePaymentMethod).toBe('function');
    expect(typeof result.current.handlePaymentStatusChange).toBe('function');
  });

  it('should handle ERROR state correctly', () => {
    const { result } = renderHook(() => useWillPayment());

    const errorStatus: GlobalStateStatus = {
      componentStatus: ComponentStatus.ERROR,
      paymentMethodStatus: PaymentMethodStatus.PENDING,
    };

    act(() => {
      result.current.handlePaymentStatusChange(errorStatus);
    });

    expect(result.current.hasDefaultPaymentMethod).toBe(false);
    expect(result.current.isPaymentMethodSaveRequired).toBe(false);
    expect(result.current.isPaymentMethodSaved).toBe(false);
    expect(result.current.isSubmittingDisabled).toBe(true);
  });

  it('should handle COMPLETED state correctly', () => {
    const { result } = renderHook(() => useWillPayment());

    const completedStatus: GlobalStateStatus = {
      componentStatus: ComponentStatus.PAYMENT_METHOD_SAVED,
      paymentMethodStatus: PaymentMethodStatus.PENDING,
    };

    act(() => {
      result.current.handlePaymentStatusChange(completedStatus);
    });

    expect(result.current.isPaymentMethodSaved).toBe(true);
    expect(result.current.isSubmittingDisabled).toBe(true); // No save required, so button disabled
  });

  it('should handle READY_TO_SAVE state correctly', () => {
    const { result } = renderHook(() => useWillPayment());

    const readyStatus: GlobalStateStatus = {
      componentStatus: ComponentStatus.READY_TO_GO_FORWARD,
      paymentMethodStatus: PaymentMethodStatus.PENDING,
    };

    act(() => {
      result.current.handlePaymentStatusChange(readyStatus);
    });

    expect(result.current.isPaymentMethodSaveRequired).toBe(true);
    expect(result.current.isPaymentMethodSaved).toBe(false);
    expect(result.current.isSubmittingDisabled).toBe(false); // Save required, so button enabled
  });

  it('should handle LOADING state correctly', () => {
    const { result } = renderHook(() => useWillPayment());

    const loadingStatus: GlobalStateStatus = {
      componentStatus: ComponentStatus.LOADING,
      paymentMethodStatus: PaymentMethodStatus.PROCESSING,
    };

    act(() => {
      result.current.handlePaymentStatusChange(loadingStatus);
    });

    expect(result.current.isPaymentMethodSaveRequired).toBe(false);
    expect(result.current.isPaymentMethodSaved).toBe(false);
    expect(result.current.isSubmittingDisabled).toBe(true); // Neither condition met, so button disabled
  });

  it('should trigger save payment method event', () => {
    const mockEventBus = document.createElement('div');
    const dispatchEventSpy = vi.fn();
    mockEventBus.dispatchEvent = dispatchEventSpy;
    document.getElementById = vi.fn().mockReturnValue(mockEventBus);

    const { result } = renderHook(() => useWillPayment());

    act(() => {
      result.current.triggerSavePaymentMethod();
    });

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'GO_SAVE_PAYMENT_METHOD',
      }),
    );
  });

  it('should handle missing event bus element gracefully', () => {
    document.getElementById = vi.fn().mockReturnValue(null);

    const { result } = renderHook(() => useWillPayment());

    expect(() => {
      act(() => {
        result.current.triggerSavePaymentMethod();
      });
    }).not.toThrow();
  });
});
