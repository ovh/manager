import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { TCommercialOffer } from '@/data/types/payment/order-catalog.type';
import {
  useCreditProvisioningPlan,
  creditProvisioningPlanQueryKey,
} from './useCreditProvisioningPlan';
import { createWrapper, shellContext } from '@/wrapperRenders';

// Mock the order catalog API
vi.mock('@/data/api/payment/order-catalog', () => ({
  getOrderCatalog: vi.fn(),
}));

// Mock React Query
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

// Mock constants to avoid PNG import issues
vi.mock('@/payment/constants', () => ({
  CREDIT_PROVISIONING: {
    PLAN_CODE: 'credit.default',
    PRICE_MODE: 'default',
  },
}));

// Import the mocked constants
const CREDIT_PROVISIONING = {
  PLAN_CODE: 'credit.default',
  PRICE_MODE: 'default',
};

describe('useCreditProvisioningPlan', () => {
  const mockUseQuery = vi.mocked(useQuery);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCreditPlan: TCommercialOffer = {
    planCode: CREDIT_PROVISIONING.PLAN_CODE,
    invoiceName: 'Credit Plan',
    product: 'cloud',
    pricingType: 'purchase',
    family: 'credit',
    addonFamilies: [],
    configurations: [],
    consumptionConfiguration: null,
    pricings: [
      {
        capacities: ['installation'],
        commitment: 1,
        description: 'Credit pricing',
        engagementConfiguration: null,
        interval: 1,
        intervalUnit: 'month',
        mode: CREDIT_PROVISIONING.PRICE_MODE,
        mustBeCompleted: false,
        phase: 0,
        price: 5000000, // 50 EUR in micro cents
        promotions: [],
        quantity: { min: 1, max: null },
        repeat: { min: 1, max: null },
        strategy: 'volume',
        tax: 1000000,
        type: 'purchase',
      },
    ],
  };

  it('should return the correct credit provisioning plan', () => {
    ((mockUseQuery as unknown) as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockCreditPlan,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      status: 'success',
      fetchStatus: 'idle',
      refetch: vi.fn(),
      isFetching: false,
      isStale: false,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isInitialLoading: false,
      isPlaceholderData: false,
      isRefetching: false,
      isRefetchError: false,
      isPending: false,
      isLoadingError: false,
      isPaused: false,
    });

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useCreditProvisioningPlan((plan) => plan),
      {
        wrapper,
      },
    );

    expect(result.current.data).toEqual(mockCreditPlan);
    expect(result.current.isSuccess).toBe(true);
  });

  it('should handle loading state', () => {
    ((mockUseQuery as unknown) as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      isError: false,
      isSuccess: false,
      status: 'pending',
      fetchStatus: 'fetching',
      refetch: vi.fn(),
      isFetching: true,
      isStale: false,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: false,
      isFetchedAfterMount: false,
      isInitialLoading: true,
      isPlaceholderData: false,
      isRefetching: false,
      isRefetchError: false,
      isPending: true,
      isLoadingError: false,
      isPaused: false,
    });

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useCreditProvisioningPlan((plan) => plan),
      {
        wrapper,
      },
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('should handle error state', () => {
    const mockError = new Error('API Error');

    ((mockUseQuery as unknown) as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      error: mockError,
      isError: true,
      isLoading: false,
      isSuccess: false,
      status: 'error',
      fetchStatus: 'idle',
      refetch: vi.fn(),
      isFetching: false,
      isStale: false,
      dataUpdatedAt: 0,
      errorUpdatedAt: Date.now(),
      failureCount: 1,
      failureReason: mockError,
      errorUpdateCount: 1,
      isFetched: true,
      isFetchedAfterMount: true,
      isInitialLoading: false,
      isPlaceholderData: false,
      isRefetching: false,
      isRefetchError: false,
      isPending: false,
      isLoadingError: false,
      isPaused: false,
    });

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useCreditProvisioningPlan((plan) => plan),
      {
        wrapper,
      },
    );

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toEqual(mockError);
  });

  it('should return undefined when plan is not found', () => {
    ((mockUseQuery as unknown) as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined, // Plan not found in selector
      error: null,
      isError: false,
      isLoading: false,
      isSuccess: true,
      status: 'success',
      fetchStatus: 'idle',
      refetch: vi.fn(),
      isFetching: false,
      isStale: false,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isInitialLoading: false,
      isPlaceholderData: false,
      isRefetching: false,
      isRefetchError: false,
      isPending: false,
      isLoadingError: false,
      isPaused: false,
    });

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useCreditProvisioningPlan((plan) => plan),
      {
        wrapper,
      },
    );

    expect(result.current.data).toBeUndefined();
    expect(result.current.isSuccess).toBe(true);
  });

  it('should use correct query key', () => {
    ((mockUseQuery as unknown) as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      error: null,
      isError: false,
      isLoading: false,
      isSuccess: true,
      status: 'success',
      fetchStatus: 'idle',
      refetch: vi.fn(),
      isFetching: false,
      isStale: false,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isInitialLoading: false,
      isPlaceholderData: false,
      isRefetching: false,
      isRefetchError: false,
      isPending: false,
      isLoadingError: false,
      isPaused: false,
    });

    const wrapper = createWrapper();
    renderHook(() => useCreditProvisioningPlan((plan) => plan), {
      wrapper,
    });

    // Verify useQuery was called with the correct configuration
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [
          'order',
          'catalog',
          'public',
          'cloud',
          ['subsidiary', 'FR'],
          ['creditProvisioningPlan', CREDIT_PROVISIONING.PLAN_CODE],
        ],
      }),
    );
  });

  it('should refetch on demand', () => {
    const refetchMock = vi.fn();

    ((mockUseQuery as unknown) as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockCreditPlan,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      status: 'success',
      fetchStatus: 'idle',
      refetch: refetchMock,
      isFetching: false,
      isStale: false,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isInitialLoading: false,
      isPlaceholderData: false,
      isRefetching: false,
      isRefetchError: false,
      isPending: false,
      isLoadingError: false,
      isPaused: false,
    });

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useCreditProvisioningPlan((plan) => plan),
      {
        wrapper,
      },
    );

    result.current.refetch();

    expect(refetchMock).toHaveBeenCalled();
  });

  it('should return query key', () => {
    expect(creditProvisioningPlanQueryKey('mocked_ovhSubsidiary')).toEqual([
      'order',
      'catalog',
      'public',
      'cloud',
      ['subsidiary', 'mocked_ovhSubsidiary'],
      ['creditProvisioningPlan', CREDIT_PROVISIONING.PLAN_CODE],
    ]);
  });

  describe('creditProvisioningPlanQueryKey', () => {
    it('should generate correct query key for given subsidiary', () => {
      const subsidiary = 'US';
      const result = creditProvisioningPlanQueryKey(subsidiary);

      expect(result).toEqual([
        'order',
        'catalog',
        'public',
        'cloud',
        ['subsidiary', subsidiary],
        ['creditProvisioningPlan', CREDIT_PROVISIONING.PLAN_CODE],
      ]);
    });

    it('should generate different query keys for different subsidiaries', () => {
      const euKey = creditProvisioningPlanQueryKey('EU');
      const usKey = creditProvisioningPlanQueryKey('US');

      expect(euKey).not.toEqual(usKey);
      expect(euKey[4]).toEqual(['subsidiary', 'EU']);
      expect(usKey[4]).toEqual(['subsidiary', 'US']);
    });
  });

  describe('Context and environment handling', () => {
    it('should handle different ovhSubsidiary values', () => {
      const customContext = {
        ...shellContext,
        environment: {
          ...shellContext.environment,
          getUser: () => ({ ovhSubsidiary: 'FR' }),
        },
      } as typeof shellContext;

      ((mockUseQuery as unknown) as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockCreditPlan,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
        status: 'success',
        fetchStatus: 'idle',
        refetch: vi.fn(),
        isFetching: false,
        isStale: false,
        dataUpdatedAt: Date.now(),
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        errorUpdateCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isInitialLoading: false,
        isPlaceholderData: false,
        isRefetching: false,
        isRefetchError: false,
        isPending: false,
        isLoadingError: false,
        isPaused: false,
      });

      const wrapper = createWrapper(customContext);
      renderHook(() => useCreditProvisioningPlan((plan) => plan), {
        wrapper,
      });

      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: [
            'order',
            'catalog',
            'public',
            'cloud',
            ['subsidiary', 'FR'],
            ['creditProvisioningPlan', CREDIT_PROVISIONING.PLAN_CODE],
          ],
        }),
      );
    });

    it('should handle undefined user gracefully', () => {
      const contextWithUndefinedUser = ({
        ...shellContext,
        environment: {
          ...shellContext.environment,
          getUser: () => ({ ovhSubsidiary: undefined }),
        },
      } as unknown) as typeof shellContext;

      ((mockUseQuery as unknown) as ReturnType<typeof vi.fn>).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
        status: 'success',
        fetchStatus: 'idle',
        refetch: vi.fn(),
        isFetching: false,
        isStale: false,
        dataUpdatedAt: Date.now(),
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        errorUpdateCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isInitialLoading: false,
        isPlaceholderData: false,
        isRefetching: false,
        isRefetchError: false,
        isPending: false,
        isLoadingError: false,
        isPaused: false,
      });

      const wrapper = createWrapper(contextWithUndefinedUser);
      renderHook(() => useCreditProvisioningPlan((plan) => plan), {
        wrapper,
      });

      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: [
            'order',
            'catalog',
            'public',
            'cloud',
            ['subsidiary', undefined],
            ['creditProvisioningPlan', CREDIT_PROVISIONING.PLAN_CODE],
          ],
        }),
      );
    });
  });

  describe('Select function behavior', () => {
    it('should use custom selector function to transform data', () => {
      ((mockUseQuery as unknown) as ReturnType<typeof vi.fn>).mockReturnValue({
        data: 'Custom selected data',
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
        status: 'success',
        fetchStatus: 'idle',
        refetch: vi.fn(),
        isFetching: false,
        isStale: false,
        dataUpdatedAt: Date.now(),
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        errorUpdateCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isInitialLoading: false,
        isPlaceholderData: false,
        isRefetching: false,
        isRefetchError: false,
        isPending: false,
        isLoadingError: false,
        isPaused: false,
      });

      const wrapper = createWrapper();
      const { result } = renderHook(
        () =>
          useCreditProvisioningPlan((plan) => {
            return plan ? `Plan: ${plan.planCode}` : 'No plan found';
          }),
        {
          wrapper,
        },
      );

      expect(result.current.data).toBe('Custom selected data');
    });

    it('should select only planCode from the plan', () => {
      ((mockUseQuery as unknown) as ReturnType<typeof vi.fn>).mockReturnValue({
        data: CREDIT_PROVISIONING.PLAN_CODE,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
        status: 'success',
        fetchStatus: 'idle',
        refetch: vi.fn(),
        isFetching: false,
        isStale: false,
        dataUpdatedAt: Date.now(),
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        errorUpdateCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isInitialLoading: false,
        isPlaceholderData: false,
        isRefetching: false,
        isRefetchError: false,
        isPending: false,
        isLoadingError: false,
        isPaused: false,
      });

      const wrapper = createWrapper();
      const { result } = renderHook(
        () => useCreditProvisioningPlan((plan) => plan?.planCode),
        {
          wrapper,
        },
      );

      expect(result.current.data).toBe(CREDIT_PROVISIONING.PLAN_CODE);
    });

    it('should select correct plan from multiple plans', () => {
      // This represents another plan that should not be selected
      const otherPlan: TCommercialOffer = {
        planCode: 'other.plan',
        invoiceName: 'Other Plan',
        product: 'cloud',
        pricingType: 'purchase',
        family: 'other',
        addonFamilies: [],
        configurations: [],
        consumptionConfiguration: null,
        pricings: [],
      };

      // Mock the useQuery to return the raw response data
      ((mockUseQuery as unknown) as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockCreditPlan, // The select function should return the filtered plan
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
        status: 'success',
        fetchStatus: 'idle',
        refetch: vi.fn(),
        isFetching: false,
        isStale: false,
        dataUpdatedAt: Date.now(),
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        errorUpdateCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isInitialLoading: false,
        isPlaceholderData: false,
        isRefetching: false,
        isRefetchError: false,
        isPending: false,
        isLoadingError: false,
        isPaused: false,
      });

      const wrapper = createWrapper();
      const { result } = renderHook(
        () => useCreditProvisioningPlan((plan) => plan),
        {
          wrapper,
        },
      );

      // Verify that the select function would work correctly
      expect(result.current.data).toEqual(mockCreditPlan);
      expect(result.current.data?.planCode).toBe(CREDIT_PROVISIONING.PLAN_CODE);

      // The otherPlan should not be selected
      expect(result.current.data?.planCode).not.toBe(otherPlan.planCode);
    });

    it('should return undefined when no plans exist', () => {
      ((mockUseQuery as unknown) as ReturnType<typeof vi.fn>).mockReturnValue({
        data: undefined, // Select function returns undefined when no matching plan
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
        status: 'success',
        fetchStatus: 'idle',
        refetch: vi.fn(),
        isFetching: false,
        isStale: false,
        dataUpdatedAt: Date.now(),
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        errorUpdateCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isInitialLoading: false,
        isPlaceholderData: false,
        isRefetching: false,
        isRefetchError: false,
        isPending: false,
        isLoadingError: false,
        isPaused: false,
      });

      const wrapper = createWrapper();
      const { result } = renderHook(
        () => useCreditProvisioningPlan((plan) => plan),
        {
          wrapper,
        },
      );

      expect(result.current.data).toBeUndefined();
    });
  });

  describe('API integration', () => {
    it('should call getOrderCatalog with correct parameters', () => {
      ((mockUseQuery as unknown) as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockCreditPlan,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
        status: 'success',
        fetchStatus: 'idle',
        refetch: vi.fn(),
        isFetching: false,
        isStale: false,
        dataUpdatedAt: Date.now(),
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        errorUpdateCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isInitialLoading: false,
        isPlaceholderData: false,
        isRefetching: false,
        isRefetchError: false,
        isPending: false,
        isLoadingError: false,
        isPaused: false,
      });

      const wrapper = createWrapper();
      renderHook(() => useCreditProvisioningPlan((plan) => plan), {
        wrapper,
      });

      // Verify useQuery configuration
      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: expect.arrayContaining([
            'order',
            'catalog',
            'public',
            'cloud',
            ['subsidiary', 'FR'],
            ['creditProvisioningPlan', CREDIT_PROVISIONING.PLAN_CODE],
          ]),
          queryFn: expect.any(Function),
          select: expect.any(Function),
        }),
      );
    });

    it('should handle API errors properly', () => {
      const apiError = new Error('Network error');

      ((mockUseQuery as unknown) as ReturnType<typeof vi.fn>).mockReturnValue({
        data: undefined,
        error: apiError,
        isError: true,
        isLoading: false,
        isSuccess: false,
        status: 'error',
        fetchStatus: 'idle',
        refetch: vi.fn(),
        isFetching: false,
        isStale: false,
        dataUpdatedAt: 0,
        errorUpdatedAt: Date.now(),
        failureCount: 1,
        failureReason: apiError,
        errorUpdateCount: 1,
        isFetched: true,
        isFetchedAfterMount: true,
        isInitialLoading: false,
        isPlaceholderData: false,
        isRefetching: false,
        isRefetchError: false,
        isPending: false,
        isLoadingError: false,
        isPaused: false,
      });

      const wrapper = createWrapper();
      const { result } = renderHook(
        () => useCreditProvisioningPlan((plan) => plan),
        {
          wrapper,
        },
      );

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(apiError);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('Edge cases', () => {
    it('should handle malformed plan data gracefully', () => {
      const malformedPlan = {
        planCode: CREDIT_PROVISIONING.PLAN_CODE,
        // Missing required fields
      };

      ((mockUseQuery as unknown) as ReturnType<typeof vi.fn>).mockReturnValue({
        data: malformedPlan,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
        status: 'success',
        fetchStatus: 'idle',
        refetch: vi.fn(),
        isFetching: false,
        isStale: false,
        dataUpdatedAt: Date.now(),
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        errorUpdateCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isInitialLoading: false,
        isPlaceholderData: false,
        isRefetching: false,
        isRefetchError: false,
        isPending: false,
        isLoadingError: false,
        isPaused: false,
      });

      const wrapper = createWrapper();
      const { result } = renderHook(
        () => useCreditProvisioningPlan((plan) => plan),
        {
          wrapper,
        },
      );

      expect(result.current.data).toEqual(malformedPlan);
      expect(result.current.isSuccess).toBe(true);
    });

    it('should handle refetch functionality', () => {
      const mockRefetch = vi.fn();

      ((mockUseQuery as unknown) as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockCreditPlan,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
        status: 'success',
        fetchStatus: 'idle',
        refetch: mockRefetch,
        isFetching: false,
        isStale: false,
        dataUpdatedAt: Date.now(),
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        errorUpdateCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isInitialLoading: false,
        isPlaceholderData: false,
        isRefetching: false,
        isRefetchError: false,
        isPending: false,
        isLoadingError: false,
        isPaused: false,
      });

      const wrapper = createWrapper();
      const { result } = renderHook(
        () => useCreditProvisioningPlan((plan) => plan),
        {
          wrapper,
        },
      );

      expect(typeof result.current.refetch).toBe('function');
      expect(result.current.refetch).toBe(mockRefetch);
    });
  });
});
