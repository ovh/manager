import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { TCommercialOffer } from '@/data/types/payment/order-catalog.type';
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

  const createMockCreditPlan = (price: number): TCommercialOffer => ({
    planCode: 'credit',
    addonFamilies: [],
    configurations: [],
    consumptionConfiguration: null,
    family: null,
    invoiceName: 'Credit',
    pricingType: 'purchase',
    product: 'credit',
    pricings: [
      {
        capacities: [],
        commitment: 1,
        description: 'Credit pricing',
        engagementConfiguration: null,
        interval: 1,
        intervalUnit: 'none',
        mode: 'create',
        mustBeCompleted: false,
        phase: 1,
        price,
        promotions: [],
        quantity: { max: null, min: 1 },
        repeat: { max: null, min: 1 },
        strategy: 'volume',
        tax: 0,
        type: 'purchase',
      },
    ],
  });

  it('should calculate PayPal charge amount correctly', () => {
    const mockPlan = createMockCreditPlan(10000000); // 10000000 micro cents

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

    expect(result.current.amount).toBe(10000000);
    expect(result.current.data).toEqual(mockPlan);
  });

  it('should handle zero price', () => {
    const mockPlan = createMockCreditPlan(0);

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

    expect(result.current.amount).toBe(0);
    expect(result.current.data).toEqual(mockPlan);
  });

  it('should handle fractional amounts correctly', () => {
    const mockPlan = createMockCreditPlan(1234567); // Fractional micro cents

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

    expect(result.current.amount).toBe(1234567);
  });

  it('should handle undefined pricing data', () => {
    const mockPlan: TCommercialOffer = {
      planCode: 'credit',
      addonFamilies: [],
      configurations: [],
      consumptionConfiguration: null,
      family: null,
      invoiceName: 'Credit',
      pricingType: 'purchase',
      product: 'credit',
      pricings: [],
    };

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

    expect(result.current.amount).toBe(0);
  });

  it('should handle undefined plan data', () => {
    mockUseCreditProvisioningPlan.mockReturnValue(({
      data: undefined,
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

    expect(result.current.amount).toBe(0);
    expect(result.current.data).toBeUndefined();
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

  it('should handle empty pricings array', () => {
    const mockPlan: TCommercialOffer = {
      planCode: 'credit',
      addonFamilies: [],
      configurations: [],
      consumptionConfiguration: null,
      family: null,
      invoiceName: 'Credit',
      pricingType: 'purchase',
      product: 'credit',
      pricings: [],
    };

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

    expect(result.current.amount).toBe(0);
  });

  it('should use correct conversion factor (micro cents to currency)', () => {
    const mockPlan = createMockCreditPlan(50000000); // 50000000 micro cents

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

    expect(result.current.amount).toBe(50000000);
  });
});
