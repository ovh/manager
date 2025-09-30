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
    expect(result.current.needsSave).toBe(false);
    expect(result.current.isSaved).toBe(false);
    expect(result.current.canSubmit).toBe(false);
    expect(result.current.isCreditPayment).toBeUndefined();
    expect(result.current.creditAmount).toBeUndefined();
    expect(typeof result.current.savePaymentMethod).toBe('function');
    expect(typeof result.current.handlePaymentStatusChange).toBe('function');
    expect(typeof result.current.handleRegisteredPaymentMethodSelected).toBe(
      'function',
    );
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
    expect(result.current.needsSave).toBe(false);
    expect(result.current.isSaved).toBe(false);
    expect(result.current.canSubmit).toBe(false);
  });

  it('should handle PAYMENT_METHOD_SAVED state correctly', () => {
    const { result } = renderHook(() => useWillPayment());

    const completedStatus: GlobalStateStatus = {
      componentStatus: ComponentStatus.PAYMENT_METHOD_SAVED,
      paymentMethodStatus: PaymentMethodStatus.PENDING,
    };

    act(() => {
      result.current.handlePaymentStatusChange(completedStatus);
    });

    expect(result.current.isSaved).toBe(true);
    expect(result.current.needsSave).toBe(false);
    expect(result.current.canSubmit).toBe(false); // No default payment method and no save required
  });

  it('should handle READY_TO_GO_FORWARD state correctly', () => {
    const { result } = renderHook(() => useWillPayment());

    const readyStatus: GlobalStateStatus = {
      componentStatus: ComponentStatus.READY_TO_GO_FORWARD,
      paymentMethodStatus: PaymentMethodStatus.PENDING,
    };

    act(() => {
      result.current.handlePaymentStatusChange(readyStatus);
    });

    expect(result.current.needsSave).toBe(true);
    expect(result.current.isSaved).toBe(false);
    expect(result.current.canSubmit).toBe(true); // Save required, so button enabled
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

    expect(result.current.needsSave).toBe(false);
    expect(result.current.isSaved).toBe(false);
    expect(result.current.canSubmit).toBe(false); // Neither condition met, so button disabled
  });

  it('should trigger save payment method event', () => {
    const mockEventBus = document.createElement('div');
    const dispatchEventSpy = vi.fn();
    mockEventBus.dispatchEvent = dispatchEventSpy;
    document.getElementById = vi.fn().mockReturnValue(mockEventBus);

    const { result } = renderHook(() => useWillPayment());

    act(() => {
      result.current.savePaymentMethod();
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
        result.current.savePaymentMethod();
      });
    }).not.toThrow();
  });

  it('should handle credit payment data correctly', () => {
    const { result } = renderHook(() => useWillPayment());

    const creditStatus: GlobalStateStatus = {
      componentStatus: ComponentStatus.READY_TO_GO_FORWARD,
      paymentMethodStatus: PaymentMethodStatus.PENDING,
      data: {
        isCredit: true,
        creditAmount: { value: 100, currency: 'EUR' },
      },
    };

    act(() => {
      result.current.handlePaymentStatusChange(creditStatus);
    });

    expect(result.current.isCreditPayment).toBe(true);
    expect(result.current.creditAmount).toEqual({
      value: 100,
      currency: 'EUR',
    });
  });

  it('should enable submit when has default payment method', () => {
    const { result } = renderHook(() => useWillPayment());

    // First set default payment method
    const mockEvent = new CustomEvent('test', {
      detail: { paymentMethodId: 'pm_123' },
    });

    act(() => {
      result.current.handleRegisteredPaymentMethodSelected(mockEvent);
    });

    expect(result.current.canSubmit).toBe(true);
  });
});
