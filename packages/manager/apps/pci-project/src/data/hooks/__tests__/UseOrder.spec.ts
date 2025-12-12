import { UseQueryResult, useQueries, useQuery } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  ORDER_FOLLOW_UP_POLLING_INTERVAL,
  ORDER_FOLLOW_UP_STATUS_ENUM,
  ORDER_FOLLOW_UP_STEP_ENUM,
  PCI_HDS_ADDON,
  PCI_HDS_DISCOVERY_ADDON,
} from '@/constants';
import {
  TOrderDetail,
  TOrderDetailExtension,
  TOrderFollowUp,
  TOrderFollowUpStatus,
  TOrderFollowUpStep,
} from '@/data/models/Order.type';
import { createWrapper } from '@/wrapperRenders';

import {
  shouldRefetchProjectCreation,
  useDeliveredProjectId,
  useOrderFollowUpPolling,
} from '../useOrder';

vi.mock('@/data/api/order');

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual: typeof import('@tanstack/react-query') = await importOriginal();
  return {
    ...actual,
    useQueries: vi.fn(),
    useQuery: vi.fn(),
  };
});

const mockUseQuery = vi.mocked(useQuery);
const mockUseQueries = vi.mocked(useQueries);

describe('useOrder hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useDeliveredProjectId', () => {
    const mockOrderId = 123;

    const createMockOrderDetail = (orderDetailId: number, domain: string): TOrderDetail => ({
      cancelled: false,
      description: 'Public Cloud Project',
      detailType: 'SETUP',
      domain,
      orderDetailId,
      quantity: '1',
      totalPrice: {
        currencyCode: 'EUR',
        priceInUcents: 0,
        text: '0.00 €',
        value: 0,
      },
      unitPrice: {
        currencyCode: 'EUR',
        priceInUcents: 0,
        text: '0.00 €',
        value: 0,
      },
    });

    const createMockOrderDetailWithExtension = (
      orderDetailId: number,
      domain: string,
      planCode: string,
    ): TOrderDetail & { extension: TOrderDetailExtension } => ({
      ...createMockOrderDetail(orderDetailId, domain),
      extension: {
        order: {
          action: 'PROVISION',
          configuration: [
            {
              label: 'project_id',
              value: 'test-project-id',
            },
          ],
          plan: {
            code: planCode,
          },
          type: 'plan',
        },
      },
    });

    it('should return project ID when HDS addon is found', () => {
      const mockOrderDetailIds = [1, 2];
      const mockOrderDetailsWithExtensions = [
        createMockOrderDetailWithExtension(1, 'test-project-123', PCI_HDS_ADDON.parentPlanCode),
        createMockOrderDetailWithExtension(2, 'other-project-456', 'other.plan.code'),
      ];

      // Mock useQuery for order detail IDs
      mockUseQuery.mockReturnValue({
        data: mockOrderDetailIds,
        isLoading: false,
        isError: false,
        error: null,
      } as unknown as UseQueryResult<unknown, unknown>);

      // Mock useQueries for order details with extensions
      mockUseQueries.mockReturnValue({
        data: mockOrderDetailsWithExtensions,
        isLoading: false,
      } as unknown as UseQueryResult<unknown, unknown>);

      const mockOnProjectIdDelivered = vi.fn();
      const { result } = renderHook(
        () =>
          useDeliveredProjectId({
            orderId: mockOrderId,
            onProjectIdDelivered: mockOnProjectIdDelivered,
          }),
        { wrapper: createWrapper() },
      );

      expect(result.current.data).toBe('test-project-123');
    });

    it('should return project ID when HDS Discovery addon is found', () => {
      const mockOrderDetailIds = [1, 2];
      const mockOrderDetailsWithExtensions = [
        createMockOrderDetailWithExtension(
          1,
          'discovery-project-789',
          PCI_HDS_DISCOVERY_ADDON.parentPlanCode,
        ),
        createMockOrderDetailWithExtension(2, 'other-project-456', 'other.plan.code'),
      ];

      mockUseQuery.mockReturnValue({
        data: mockOrderDetailIds,
        isLoading: false,
        isError: false,
        error: null,
      } as unknown as UseQueryResult<unknown, unknown>);

      mockUseQueries.mockReturnValue({
        data: mockOrderDetailsWithExtensions,
        isLoading: false,
      });

      const mockOnProjectIdDelivered = vi.fn();
      const { result } = renderHook(
        () =>
          useDeliveredProjectId({
            orderId: mockOrderId,
            onProjectIdDelivered: mockOnProjectIdDelivered,
          }),
        { wrapper: createWrapper() },
      );

      expect(result.current.data).toBe('discovery-project-789');
    });

    it('should return undefined when no matching addon is found', () => {
      const mockOrderDetailIds = [1, 2];
      const mockOrderDetailsWithExtensions = [
        createMockOrderDetailWithExtension(1, 'test-project-123', 'some.other.plan'),
        createMockOrderDetailWithExtension(2, 'other-project-456', 'another.plan.code'),
      ];

      mockUseQuery.mockReturnValue({
        data: mockOrderDetailIds,
        isLoading: false,
        isError: false,
        error: null,
      } as unknown as UseQueryResult<unknown, unknown>);

      mockUseQueries.mockReturnValue({
        data: mockOrderDetailsWithExtensions,
        isLoading: false,
      });

      const mockOnProjectIdDelivered = vi.fn();
      const { result } = renderHook(
        () =>
          useDeliveredProjectId({
            orderId: mockOrderId,
            onProjectIdDelivered: mockOnProjectIdDelivered,
          }),
        { wrapper: createWrapper() },
      );

      expect(result.current.data).toBeUndefined();
    });

    it('should return undefined when still loading', () => {
      mockUseQuery.mockReturnValue({
        data: [],
        isLoading: true,
        isError: false,
        error: null,
      } as unknown as UseQueryResult<unknown, unknown>);

      mockUseQueries.mockReturnValue({
        data: [],
        isLoading: true,
      });

      const mockOnProjectIdDelivered = vi.fn();
      const { result } = renderHook(
        () =>
          useDeliveredProjectId({
            orderId: mockOrderId,
            onProjectIdDelivered: mockOnProjectIdDelivered,
          }),
        { wrapper: createWrapper() },
      );

      expect(result.current.data).toBeUndefined();
    });

    it('should return undefined when no data is available', () => {
      mockUseQuery.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
      } as unknown as UseQueryResult<unknown, unknown>);

      mockUseQueries.mockReturnValue({
        data: [],
        isLoading: false,
      });

      const mockOnProjectIdDelivered = vi.fn();
      const { result } = renderHook(
        () =>
          useDeliveredProjectId({
            orderId: mockOrderId,
            onProjectIdDelivered: mockOnProjectIdDelivered,
          }),
        { wrapper: createWrapper() },
      );

      expect(result.current.data).toBeUndefined();
    });

    it('should be disabled when enabled is false', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
      } as unknown as UseQueryResult<unknown, unknown>);

      mockUseQueries.mockReturnValue({
        data: [],
        isLoading: false,
      });

      const mockOnProjectIdDelivered = vi.fn();
      renderHook(
        () =>
          useDeliveredProjectId({
            orderId: mockOrderId,
            enabled: false,
            onProjectIdDelivered: mockOnProjectIdDelivered,
          }),
        { wrapper: createWrapper() },
      );

      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: false,
        }),
      );
    });
  });

  describe('useOrderFollowUpPolling', () => {
    const mockOrderId = 456;
    const mockOnProjectDelivered = vi.fn();
    const mockOnProjectDeliveryFail = vi.fn();

    beforeEach(() => {
      mockOnProjectDelivered.mockClear();
      mockOnProjectDeliveryFail.mockClear();
    });

    it('should configure query correctly', () => {
      mockUseQuery.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
      } as unknown as UseQueryResult<unknown, unknown>);

      renderHook(
        () =>
          useOrderFollowUpPolling({
            orderId: mockOrderId,
            onProjectDelivered: mockOnProjectDelivered,
            onProjectDeliveryFail: mockOnProjectDeliveryFail,
          }),
        { wrapper: createWrapper() },
      );

      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ['/me/order/456/followUp/polling'],
          queryFn: expect.any(Function) as () => Promise<unknown>,
          enabled: true,
          refetchInterval: expect.any(Function) as () => boolean | number,
          refetchIntervalInBackground: true,
        }),
      );
    });

    it('should stop polling and call onProjectDeliveryFail when any step has error status', () => {
      const mockFollowUpData: TOrderFollowUp[] = [
        {
          step: ORDER_FOLLOW_UP_STEP_ENUM.VALIDATING as TOrderFollowUpStep,
          status: ORDER_FOLLOW_UP_STATUS_ENUM.ERROR as TOrderFollowUpStatus,
          history: [],
        },
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockUseQuery.mockImplementation((options: any) => {
        const { refetchInterval } = options;

        const intervalResult = refetchInterval({
          state: { data: mockFollowUpData, error: null },
        });
        expect(intervalResult).toBe(false);
        expect(mockOnProjectDeliveryFail).toHaveBeenCalled();

        return {
          data: mockFollowUpData,
          isLoading: false,
          isError: false,
          error: null,
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      });

      renderHook(
        () =>
          useOrderFollowUpPolling({
            orderId: mockOrderId,
            onProjectDelivered: mockOnProjectDelivered,
            onProjectDeliveryFail: mockOnProjectDeliveryFail,
          }),
        { wrapper: createWrapper() },
      );
    });

    it('should continue polling when no follow up data is available', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockUseQuery.mockImplementation((options: any) => {
        const { refetchInterval } = options;

        const intervalResult = refetchInterval({
          state: { data: null, error: null },
        });
        expect(intervalResult).toBe(ORDER_FOLLOW_UP_POLLING_INTERVAL);

        return {
          data: null,
          isLoading: false,
          isError: false,
          error: null,
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      });

      renderHook(
        () =>
          useOrderFollowUpPolling({
            orderId: mockOrderId,
            onProjectDelivered: mockOnProjectDelivered,
            onProjectDeliveryFail: mockOnProjectDeliveryFail,
          }),
        { wrapper: createWrapper() },
      );
    });

    it('should stop polling and call onProjectDelivered when delivery is complete', () => {
      const mockFollowUpData: TOrderFollowUp[] = [
        {
          step: ORDER_FOLLOW_UP_STEP_ENUM.DELIVERING as TOrderFollowUpStep,
          status: ORDER_FOLLOW_UP_STATUS_ENUM.DONE as TOrderFollowUpStatus,
          history: [],
        },
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockUseQuery.mockImplementation((options: any) => {
        const { refetchInterval } = options;

        const intervalResult = refetchInterval({
          state: { data: mockFollowUpData, error: null },
        });
        expect(intervalResult).toBe(false);
        expect(mockOnProjectDelivered).toHaveBeenCalled();

        return {
          data: mockFollowUpData,
          isLoading: false,
          isError: false,
          error: null,
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      });

      renderHook(
        () =>
          useOrderFollowUpPolling({
            orderId: mockOrderId,
            onProjectDelivered: mockOnProjectDelivered,
            onProjectDeliveryFail: mockOnProjectDeliveryFail,
          }),
        { wrapper: createWrapper() },
      );
    });

    it('should continue polling when delivery is in progress', () => {
      const mockFollowUpData: TOrderFollowUp[] = [
        {
          step: ORDER_FOLLOW_UP_STEP_ENUM.DELIVERING as TOrderFollowUpStep,
          status: ORDER_FOLLOW_UP_STATUS_ENUM.DOING as TOrderFollowUpStatus,
          history: [],
        },
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockUseQuery.mockImplementation((options: any) => {
        const { refetchInterval } = options;

        const intervalResult = refetchInterval({
          state: { data: mockFollowUpData, error: null },
        });
        expect(intervalResult).toBe(ORDER_FOLLOW_UP_POLLING_INTERVAL);

        return {
          data: mockFollowUpData,
          isLoading: false,
          isError: false,
          error: null,
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      });

      renderHook(
        () =>
          useOrderFollowUpPolling({
            orderId: mockOrderId,
            onProjectDelivered: mockOnProjectDelivered,
            onProjectDeliveryFail: mockOnProjectDeliveryFail,
          }),
        { wrapper: createWrapper() },
      );

      expect(mockOnProjectDelivered).not.toHaveBeenCalled();
      expect(mockOnProjectDeliveryFail).not.toHaveBeenCalled();
    });

    it('should be disabled when orderId is not provided', () => {
      mockUseQuery.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null,
      } as unknown as UseQueryResult<unknown, unknown>);

      renderHook(
        () =>
          useOrderFollowUpPolling({
            orderId: 0,
            onProjectDelivered: mockOnProjectDelivered,
            onProjectDeliveryFail: mockOnProjectDeliveryFail,
          }),
        { wrapper: createWrapper() },
      );

      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: false,
        }),
      );
    });
  });

  describe('shouldRefetchProjectCreation', () => {
    const mockOnProjectDelivered = vi.fn();
    const mockOnProjectDeliveryFail = vi.fn();

    beforeEach(() => {
      mockOnProjectDelivered.mockClear();
      mockOnProjectDeliveryFail.mockClear();
    });

    it('should continue polling when no follow up data', () => {
      const result = shouldRefetchProjectCreation(
        mockOnProjectDelivered,
        mockOnProjectDeliveryFail,
      );

      expect(result).toBe(ORDER_FOLLOW_UP_POLLING_INTERVAL);
      expect(mockOnProjectDelivered).not.toHaveBeenCalled();
      expect(mockOnProjectDeliveryFail).not.toHaveBeenCalled();
    });

    it('should stop polling and call onProjectDelivered when delivery is complete', () => {
      const mockFollowUpData: TOrderFollowUp[] = [
        {
          step: ORDER_FOLLOW_UP_STEP_ENUM.DELIVERING as TOrderFollowUpStep,
          status: ORDER_FOLLOW_UP_STATUS_ENUM.DONE as TOrderFollowUpStatus,
          history: [],
        },
      ];

      const result = shouldRefetchProjectCreation(
        mockOnProjectDelivered,
        mockOnProjectDeliveryFail,
        mockFollowUpData,
      );

      expect(result).toBe(false);
      expect(mockOnProjectDelivered).toHaveBeenCalledTimes(1);
      expect(mockOnProjectDeliveryFail).not.toHaveBeenCalled();
    });

    it('should stop polling and call onProjectDeliveryFail when error occurs', () => {
      const mockFollowUpData: TOrderFollowUp[] = [
        {
          step: ORDER_FOLLOW_UP_STEP_ENUM.VALIDATING as TOrderFollowUpStep,
          status: ORDER_FOLLOW_UP_STATUS_ENUM.ERROR as TOrderFollowUpStatus,
          history: [],
        },
      ];

      const result = shouldRefetchProjectCreation(
        mockOnProjectDelivered,
        mockOnProjectDeliveryFail,
        mockFollowUpData,
      );

      expect(result).toBe(false);
      expect(mockOnProjectDeliveryFail).toHaveBeenCalledTimes(1);
      expect(mockOnProjectDelivered).not.toHaveBeenCalled();
    });

    it('should continue polling when delivery is in progress', () => {
      const mockFollowUpData: TOrderFollowUp[] = [
        {
          step: ORDER_FOLLOW_UP_STEP_ENUM.DELIVERING as TOrderFollowUpStep,
          status: ORDER_FOLLOW_UP_STATUS_ENUM.DOING as TOrderFollowUpStatus,
          history: [],
        },
      ];

      const result = shouldRefetchProjectCreation(
        mockOnProjectDelivered,
        mockOnProjectDeliveryFail,
        mockFollowUpData,
      );

      expect(result).toBe(ORDER_FOLLOW_UP_POLLING_INTERVAL);
      expect(mockOnProjectDelivered).not.toHaveBeenCalled();
      expect(mockOnProjectDeliveryFail).not.toHaveBeenCalled();
    });
  });
});
