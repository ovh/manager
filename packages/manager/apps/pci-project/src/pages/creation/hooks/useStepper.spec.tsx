import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useStepper } from './useStepper';

describe('useStepper', () => {
  it('should initialize with Config step and correct initial state', () => {
    const { result } = renderHook(() => useStepper());

    expect(result.current.isConfigChecked).toBe(false);
    expect(result.current.isConfigLocked).toBe(false);
    expect(result.current.isPaymentOpen).toBe(false);
    expect(result.current.isPaymentChecked).toBe(false);
    expect(result.current.isPaymentLocked).toBe(true);
    expect(result.current.isCreditConfirmationOpen).toBe(false);
    expect(result.current.isCreditConfirmationChecked).toBe(false);
    expect(result.current.isCreditConfirmationLocked).toBe(false);
  });

  it('should update step state when moving to Payment step', () => {
    const { result } = renderHook(() => useStepper());

    act(() => {
      result.current.goToPayment();
    });

    expect(result.current.isConfigChecked).toBe(true);
    expect(result.current.isConfigLocked).toBe(true);
    expect(result.current.isPaymentOpen).toBe(true);
    expect(result.current.isPaymentChecked).toBe(false);
    expect(result.current.isPaymentLocked).toBe(false);
    expect(result.current.isCreditConfirmationOpen).toBe(false);
  });

  it('should handle step transitions correctly', () => {
    const { result } = renderHook(() => useStepper());

    // Start at Config step
    expect(result.current.isPaymentLocked).toBe(true);
    expect(result.current.isConfigChecked).toBe(false);

    // Move to Payment step
    act(() => {
      result.current.goToPayment();
    });

    expect(result.current.isConfigChecked).toBe(true);
    expect(result.current.isConfigLocked).toBe(true);
    expect(result.current.isPaymentOpen).toBe(true);
    expect(result.current.isPaymentLocked).toBe(false);

    // Move back to Config step
    act(() => {
      result.current.goToConfig();
    });

    expect(result.current.isConfigChecked).toBe(false);
    expect(result.current.isConfigLocked).toBe(false);
    expect(result.current.isPaymentOpen).toBe(false);
    expect(result.current.isPaymentLocked).toBe(true);
  });

  it('should handle CreditConfirmation step correctly', () => {
    const { result } = renderHook(() => useStepper());

    act(() => {
      result.current.goToCreditConfirmation();
    });

    expect(result.current.isConfigChecked).toBe(true);
    expect(result.current.isConfigLocked).toBe(true);
    expect(result.current.isPaymentOpen).toBe(true);
    expect(result.current.isPaymentChecked).toBe(true);
    expect(result.current.isPaymentLocked).toBe(true); // Not Payment step
    expect(result.current.isCreditConfirmationOpen).toBe(true);
    expect(result.current.isCreditConfirmationChecked).toBe(false);
    expect(result.current.isCreditConfirmationLocked).toBe(false);
  });

  it('should provide all expected return values', () => {
    const { result } = renderHook(() => useStepper());

    expect(result.current).toEqual({
      // Step states
      isConfigChecked: expect.any(Boolean),
      isConfigLocked: expect.any(Boolean),
      isPaymentOpen: expect.any(Boolean),
      isPaymentChecked: expect.any(Boolean),
      isPaymentLocked: expect.any(Boolean),
      isCreditConfirmationOpen: expect.any(Boolean),
      isCreditConfirmationChecked: expect.any(Boolean),
      isCreditConfirmationLocked: expect.any(Boolean),
      // Navigation functions
      goToConfig: expect.any(Function),
      goToPayment: expect.any(Function),
      goToCreditConfirmation: expect.any(Function),
    });
  });

  it('should test all navigation functions', () => {
    const { result } = renderHook(() => useStepper());

    // Test goToConfig
    act(() => {
      result.current.goToPayment(); // First go to payment
    });
    expect(result.current.isPaymentOpen).toBe(true);

    act(() => {
      result.current.goToConfig(); // Then back to config
    });
    expect(result.current.isPaymentOpen).toBe(false);
    expect(result.current.isConfigChecked).toBe(false);

    // Test goToPayment
    act(() => {
      result.current.goToPayment();
    });
    expect(result.current.isPaymentOpen).toBe(true);
    expect(result.current.isConfigChecked).toBe(true);

    // Test goToCreditConfirmation
    act(() => {
      result.current.goToCreditConfirmation();
    });
    expect(result.current.isCreditConfirmationOpen).toBe(true);
    expect(result.current.isPaymentChecked).toBe(true);
  });
});
