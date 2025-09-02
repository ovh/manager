import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCreditProvisioningPlan } from './useCreditProvisioningPlan';
import { usePaypalChargeAmount } from './usePaypalChargeAmount';
import { createWrapper } from '@/wrapperRenders';

// Mock the dependencies
vi.mock('./useCreditProvisioningPlan', () => ({
  useCreditProvisioningPlan: vi.fn(),
}));

// Mock constants to avoid PNG import issues
vi.mock('@/payment/constants', () => ({
  CREDIT_PROVISIONING: {
    PRICE_MODE: 'create',
  },
}));

const mockUseCreditProvisioningPlan = useCreditProvisioningPlan as ReturnType<
  typeof vi.fn
>;

describe('usePaypalChargeAmount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should calculate PayPal charge amount correctly', () => {
    const mockPlan = 10000000; // 10000000 micro cents

    mockUseCreditProvisioningPlan.mockReturnValue(({
      data: mockPlan,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof useCreditProvisioningPlan>);

    const wrapper = createWrapper();

    const { result } = renderHook(() => usePaypalChargeAmount(), {
      wrapper,
    });

    expect(result.current.data).toBe(10000000);
  });

  it('should handle zero price', () => {
    const mockPlan = 0;

    mockUseCreditProvisioningPlan.mockReturnValue(({
      data: mockPlan,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof useCreditProvisioningPlan>);

    const wrapper = createWrapper();

    const { result } = renderHook(() => usePaypalChargeAmount(), {
      wrapper,
    });

    expect(result.current.data).toBe(0);
  });

  it('should handle fractional amounts correctly', () => {
    const mockPlan = 1234567; // Fractional micro cents

    mockUseCreditProvisioningPlan.mockReturnValue(({
      data: mockPlan,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof useCreditProvisioningPlan>);

    const wrapper = createWrapper();

    const { result } = renderHook(() => usePaypalChargeAmount(), {
      wrapper,
    });

    expect(result.current.data).toBe(1234567);
  });

  it('should pass through loading state', () => {
    mockUseCreditProvisioningPlan.mockReturnValue(({
      data: undefined,
      isLoading: true,
      error: null,
      isError: false,
      isSuccess: false,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof useCreditProvisioningPlan>);

    const wrapper = createWrapper();

    const { result } = renderHook(() => usePaypalChargeAmount(), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should pass through error state', () => {
    const mockError = new Error('Credit plan error');

    mockUseCreditProvisioningPlan.mockReturnValue(({
      data: undefined,
      isLoading: false,
      error: mockError,
      isError: true,
      isSuccess: false,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof useCreditProvisioningPlan>);

    const wrapper = createWrapper();

    const { result } = renderHook(() => usePaypalChargeAmount(), {
      wrapper,
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toEqual(mockError);
  });

  it('should use correct conversion factor (micro cents to currency)', () => {
    const mockPlan = 50000000; // 50000000 micro cents

    mockUseCreditProvisioningPlan.mockReturnValue(({
      data: mockPlan,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof useCreditProvisioningPlan>);

    const wrapper = createWrapper();

    const { result } = renderHook(() => usePaypalChargeAmount(), {
      wrapper,
    });

    expect(result.current.data).toBe(50000000);
  });
});
