import { useQueries, useQuery } from '@tanstack/react-query';
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
} from '@/data/types/order.type';
import { createWrapper } from '@/wrapperRenders';
import { useDeliveredProjectId, useOrderFollowUpPolling } from './useOrder';

vi.mock('@/data/api/order');

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual: typeof import('@tanstack/react-query') = await importOriginal();
  return {
    ...actual,
    useQueries: vi.fn(),
    useQuery: vi.fn(),
  };
});

describe('useOrder hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useDeliveredProjectId', () => {
    const mockOrderId = 123;

    const createMockOrderDetail = (
      orderDetailId: number,
      domain: string,
    ): TOrderDetail => ({
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
        createMockOrderDetailWithExtension(
          1,
          'test-project-123',
          PCI_HDS_ADDON.parentPlanCode,
        ),
        createMockOrderDetailWithExtension(
          2,
          'other-project-456',
          'other.plan.code',
        ),
      ];

      // Mock useQuery for order detail IDs
      vi.mocked(useQuery).mockReturnValue(({
        data: mockOrderDetailIds,
        isLoading: false,
        isError: false,
        error: null,
      } as unknown) as ReturnType<typeof useQuery>);

      // Mock useQueries for order details with extensions
      vi.mocked(useQueries).mockReturnValue({
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
        createMockOrderDetailWithExtension(
          2,
          'other-project-456',
          'other.plan.code',
        ),
      ];

      vi.mocked(useQuery).mockReturnValue(({
        data: mockOrderDetailIds,
        isLoading: false,
        isError: false,
        error: null,
      } as unknown) as ReturnType<typeof useQuery>);

      vi.mocked(useQueries).mockReturnValue({
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
        createMockOrderDetailWithExtension(
          1,
          'test-project-123',
          'some.other.plan',
        ),
        createMockOrderDetailWithExtension(
          2,
          'other-project-456',
          'another.plan.code',
        ),
      ];

      vi.mocked(useQuery).mockReturnValue(({
        data: mockOrderDetailIds,
        isLoading: false,
        isError: false,
        error: null,
      } as unknown) as ReturnType<typeof useQuery>);

      vi.mocked(useQueries).mockReturnValue({
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
      vi.mocked(useQuery).mockReturnValue(({
        data: [],
        isLoading: true,
        isError: false,
        error: null,
      } as unknown) as ReturnType<typeof useQuery>);

      vi.mocked(useQueries).mockReturnValue({
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
      vi.mocked(useQuery).mockReturnValue(({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
      } as unknown) as ReturnType<typeof useQuery>);

      vi.mocked(useQueries).mockReturnValue({
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
      vi.mocked(useQuery).mockReturnValue(({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
      } as unknown) as ReturnType<typeof useQuery>);

      vi.mocked(useQueries).mockReturnValue({
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

      expect(useQuery).toHaveBeenCalledWith(
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
      vi.mocked(useQuery).mockReturnValue(({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
      } as unknown) as ReturnType<typeof useQuery>);

      renderHook(
        () =>
          useOrderFollowUpPolling({
            orderId: mockOrderId,
            onProjectDelivered: mockOnProjectDelivered,
            onProjectDeliveryFail: mockOnProjectDeliveryFail,
          }),
        { wrapper: createWrapper() },
      );

      expect(useQuery).toHaveBeenCalledWith({
        queryKey: ['/me/order/456/followUp/polling'],
        queryFn: expect.any(Function),
        enabled: true,
        refetchInterval: expect.any(Function),
        refetchIntervalInBackground: true,
      });
    });

    it('should stop polling and call onProjectDeliveryFail when any step has error status', () => {
      const mockFollowUpData: TOrderFollowUp[] = [
        {
          step: ORDER_FOLLOW_UP_STEP_ENUM.VALIDATING as TOrderFollowUpStep,
          status: ORDER_FOLLOW_UP_STATUS_ENUM.ERROR as TOrderFollowUpStatus,
          history: [],
        },
      ];

      vi.mocked(useQuery).mockImplementation(({ refetchInterval }) => {
        const intervalResult = (refetchInterval as (args: {
          state: { data: unknown; error: unknown };
        }) => boolean | number)({
          state: { data: mockFollowUpData, error: null },
        });
        expect(intervalResult).toBe(false);
        expect(mockOnProjectDeliveryFail).toHaveBeenCalled();

        return ({
          data: mockFollowUpData,
          isLoading: false,
          isError: false,
          error: null,
        } as unknown) as ReturnType<typeof useQuery>;
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
      vi.mocked(useQuery).mockImplementation(({ refetchInterval }) => {
        const intervalResult = (refetchInterval as (args: {
          state: { data: unknown; error: unknown };
        }) => boolean | number)({
          state: { data: null, error: null },
        });
        expect(intervalResult).toBe(ORDER_FOLLOW_UP_POLLING_INTERVAL);

        return ({
          data: null,
          isLoading: false,
          isError: false,
          error: null,
        } as unknown) as ReturnType<typeof useQuery>;
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

      vi.mocked(useQuery).mockImplementation(({ refetchInterval }) => {
        const intervalResult = (refetchInterval as (args: {
          state: { data: unknown; error: unknown };
        }) => boolean | number)({
          state: { data: mockFollowUpData, error: null },
        });
        expect(intervalResult).toBe(false);
        expect(mockOnProjectDelivered).toHaveBeenCalled();

        return ({
          data: mockFollowUpData,
          isLoading: false,
          isError: false,
          error: null,
        } as unknown) as ReturnType<typeof useQuery>;
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

      vi.mocked(useQuery).mockImplementation(({ refetchInterval }) => {
        const intervalResult = (refetchInterval as (args: {
          state: { data: unknown; error: unknown };
        }) => boolean | number)({
          state: { data: mockFollowUpData, error: null },
        });
        expect(intervalResult).toBe(ORDER_FOLLOW_UP_POLLING_INTERVAL);

        return ({
          data: mockFollowUpData,
          isLoading: false,
          isError: false,
          error: null,
        } as unknown) as ReturnType<typeof useQuery>;
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
      vi.mocked(useQuery).mockReturnValue(({
        data: null,
        isLoading: false,
        isError: false,
        error: null,
      } as unknown) as ReturnType<typeof useQuery>);

      renderHook(
        () =>
          useOrderFollowUpPolling({
            orderId: 0,
            onProjectDelivered: mockOnProjectDelivered,
            onProjectDeliveryFail: mockOnProjectDeliveryFail,
          }),
        { wrapper: createWrapper() },
      );

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: false,
        }),
      );
    });
  });
});
