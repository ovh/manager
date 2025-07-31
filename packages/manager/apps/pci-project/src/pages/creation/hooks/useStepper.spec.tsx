/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useStepper } from './useStepper';

describe('useStepper', () => {
  it('should initialize with step 0 and correct initial state', async () => {
    const { result } = renderHook(() => useStepper());

    expect(result.current.currentStep).toBe(0);
    expect(result.current.isConfigChecked).toBe(false);
    expect(result.current.isConfigLocked).toBe(false);
    expect(result.current.isPaymentOpen).toBe(false);
    expect(result.current.isPaymentChecked).toBe(false);
    expect(result.current.isPaymentLocked).toBe(true);
  });

  it('should update step state when currentStep changes to 1', async () => {
    const { result } = renderHook(() => useStepper());

    await act(async () => {
      result.current.setCurrentStep(1);
    });

    expect(result.current.currentStep).toBe(1);
    expect(result.current.isConfigChecked).toBe(true);
    expect(result.current.isConfigLocked).toBe(true);
    expect(result.current.isPaymentOpen).toBe(true);
    expect(result.current.isPaymentChecked).toBe(false);
    expect(result.current.isPaymentLocked).toBe(false);
  });

  it('should handle step transitions correctly', async () => {
    const { result } = renderHook(() => useStepper());

    // Start at step 0
    expect(result.current.currentStep).toBe(0);
    expect(result.current.isPaymentLocked).toBe(true);
    expect(result.current.isConfigChecked).toBe(false);

    // Move to step 1
    await act(async () => {
      result.current.setCurrentStep(1);
    });

    expect(result.current.currentStep).toBe(1);
    expect(result.current.isConfigChecked).toBe(true);
    expect(result.current.isConfigLocked).toBe(true);
    expect(result.current.isPaymentOpen).toBe(true);
    expect(result.current.isPaymentLocked).toBe(false);

    // Move back to step 0
    await act(async () => {
      result.current.setCurrentStep(0);
    });

    expect(result.current.currentStep).toBe(0);
    expect(result.current.isConfigChecked).toBe(false);
    expect(result.current.isConfigLocked).toBe(false);
    expect(result.current.isPaymentOpen).toBe(false);
    expect(result.current.isPaymentLocked).toBe(true);
  });

  it('should handle steps beyond the current flow', async () => {
    const { result } = renderHook(() => useStepper());

    await act(async () => {
      result.current.setCurrentStep(2);
    });

    expect(result.current.currentStep).toBe(2);
    expect(result.current.isConfigChecked).toBe(true);
    expect(result.current.isConfigLocked).toBe(true);
    expect(result.current.isPaymentOpen).toBe(false); // Only true when step === 1
    expect(result.current.isPaymentChecked).toBe(false); // Always false per comment
    expect(result.current.isPaymentLocked).toBe(false);
  });

  it('should provide all expected return values', async () => {
    const { result } = renderHook(() => useStepper());

    expect(result.current).toEqual({
      currentStep: expect.any(Number),
      setCurrentStep: expect.any(Function),
      isConfigChecked: expect.any(Boolean),
      isConfigLocked: expect.any(Boolean),
      isPaymentOpen: expect.any(Boolean),
      isPaymentChecked: expect.any(Boolean),
      isPaymentLocked: expect.any(Boolean),
    });
  });
});
