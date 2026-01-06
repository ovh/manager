import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useStepper } from '../useStepper';

type UseStepperReturn = ReturnType<typeof useStepper>;

function renderStepperHook() {
  return renderHook(() => useStepper());
}

// Helper function to safely call a method from UseStepperReturn
function callMethod(
  current: UseStepperReturn,
  methodName: 'goToConfig' | 'goToPayment' | 'goToCreditConfirmation',
): void {
  const method = current[methodName];
  if (typeof method === 'function') {
    (method as () => void)();
  }
}

describe('useStepper', () => {
  it('should initialize with Config step and correct initial state', () => {
    const { result } = renderStepperHook();
    const current = result.current;

    expect(current.isConfigChecked).toBe(false);
    expect(current.isConfigLocked).toBe(false);
    expect(current.isPaymentOpen).toBe(false);
    expect(current.isPaymentChecked).toBe(false);
    expect(current.isPaymentLocked).toBe(true);
    expect(current.isCreditConfirmationOpen).toBe(false);
    expect(current.isCreditConfirmationChecked).toBe(false);
    expect(current.isCreditConfirmationLocked).toBe(false) as unknown as boolean;
  });

  it('should update step state when moving to Payment step', () => {
    const { result } = renderStepperHook();
    const current = result.current;

    const callback: () => void = () => {
      callMethod(current, 'goToPayment');
    };
    (act as (callback: () => void) => void)(callback);

    const updatedCurrent = result.current;
    expect(updatedCurrent.isConfigChecked).toBe(true);
    expect(updatedCurrent.isConfigLocked).toBe(true);
    expect(updatedCurrent.isPaymentOpen).toBe(true);
    expect(updatedCurrent.isPaymentChecked).toBe(false);
    expect(updatedCurrent.isPaymentLocked).toBe(false);
    expect(updatedCurrent.isCreditConfirmationOpen).toBe(false);
  });

  it('should handle step transitions correctly', () => {
    const { result } = renderStepperHook();
    let current = result.current;

    // Start at Config step
    expect(current.isPaymentLocked).toBe(true);
    expect(current.isConfigChecked).toBe(false);

    // Move to Payment step
    const callback: () => void = () => {
      callMethod(current, 'goToPayment');
    };
    (act as (callback: () => void) => void)(callback);

    current = result.current;
    expect(current.isConfigChecked).toBe(true);
    expect(current.isConfigLocked).toBe(true);
    expect(current.isPaymentOpen).toBe(true);
    expect(current.isPaymentLocked).toBe(false);

    // Move back to Config step
    const callbackConfig: () => void = () => {
      callMethod(current, 'goToConfig');
    };
    (act as (callback: () => void) => void)(callbackConfig);

    current = result.current;
    expect(current.isConfigChecked).toBe(false);
    expect(current.isConfigLocked).toBe(false);
    expect(current.isPaymentOpen).toBe(false);
    expect(current.isPaymentLocked).toBe(true);
  });

  it('should handle CreditConfirmation step correctly', () => {
    const { result } = renderStepperHook();
    const current = result.current;

    const callback: () => void = () => {
      callMethod(current, 'goToCreditConfirmation');
    };
    (act as (callback: () => void) => void)(callback);

    const updatedCurrent = result.current;
    expect(updatedCurrent.isConfigChecked).toBe(true);
    expect(updatedCurrent.isConfigLocked).toBe(true);
    expect(updatedCurrent.isPaymentOpen).toBe(true);
    expect(updatedCurrent.isPaymentChecked).toBe(true);
    expect(updatedCurrent.isPaymentLocked).toBe(true); // Not Payment step
    expect(updatedCurrent.isCreditConfirmationOpen).toBe(true);
    expect(updatedCurrent.isCreditConfirmationChecked).toBe(false);
    expect(updatedCurrent.isCreditConfirmationLocked).toBe(false);
  });

  it('should provide all expected return values', () => {
    const { result } = renderStepperHook();
    const current = result.current;

    expect(current).toEqual({
      // Step states
      isConfigChecked: expect.any(Boolean) as boolean,
      isConfigLocked: expect.any(Boolean) as boolean,
      isPaymentOpen: expect.any(Boolean) as boolean,
      isPaymentChecked: expect.any(Boolean) as boolean,
      isPaymentLocked: expect.any(Boolean) as boolean,
      isCreditConfirmationOpen: expect.any(Boolean) as boolean,
      isCreditConfirmationChecked: expect.any(Boolean) as boolean,
      isCreditConfirmationLocked: expect.any(Boolean) as boolean,
      // Navigation functions
      goToConfig: expect.any(Function) as () => void,
      goToPayment: expect.any(Function) as () => void,
      goToCreditConfirmation: expect.any(Function) as () => void,
    });
  });

  it('should test all navigation functions', () => {
    const { result } = renderStepperHook();
    let current = result.current;

    // Test goToConfig
    const callback1: () => void = () => {
      callMethod(current, 'goToPayment'); // First go to payment
    };
    (act as (callback: () => void) => void)(callback1);
    current = result.current;
    expect(current.isPaymentOpen).toBe(true);

    const callback2: () => void = () => {
      callMethod(current, 'goToConfig'); // Then back to config
    };
    (act as (callback: () => void) => void)(callback2);
    current = result.current;
    expect(current.isPaymentOpen).toBe(false);
    expect(current.isConfigChecked).toBe(false);

    // Test goToPayment
    const callback: () => void = () => {
      callMethod(current, 'goToPayment');
    };
    (act as (callback: () => void) => void)(callback);
    current = result.current;
    expect(current.isPaymentOpen).toBe(true);
    expect(current.isConfigChecked).toBe(true);

    // Test goToCreditConfirmation
    const callbackCredit: () => void = () => {
      callMethod(current, 'goToCreditConfirmation');
    };
    (act as (callback: () => void) => void)(callbackCredit);
    current = result.current;
    expect(current.isCreditConfirmationOpen).toBe(true);
    expect(current.isPaymentChecked).toBe(true);
  });
});
