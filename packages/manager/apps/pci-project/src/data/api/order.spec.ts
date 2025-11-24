import { describe, it, expect, vi, beforeEach } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  getOrderFollowUp,
  getOrderDetails,
  getOrderDetailWithExtension,
} from './order';
import {
  TOrderDetail,
  TOrderFollowUp,
  TOrderDetailExtension,
  TOrderFollowUpStatus,
  TOrderFollowUpStep,
  TOrderFollowUpLabel,
} from '@/data/types/order.type';

describe('order API', () => {
  // Mock data factories
  const createMockOrderDetail = (
    overrides: Partial<TOrderDetail> = {},
  ): TOrderDetail => ({
    cancelled: false,
    description: 'Public Cloud Project',
    detailType: 'SETUP',
    domain: 'pci-project-123',
    orderDetailId: 111,
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
    ...overrides,
  });

  const createMockOrderDetailExtension = (
    overrides: Partial<TOrderDetailExtension> = {},
  ): TOrderDetailExtension => ({
    order: {
      action: 'PROVISION',
      configuration: [
        {
          label: 'project_id',
          value: 'pci-project-123',
        },
      ],
      plan: {
        code: 'project.2018',
      },
      type: 'plan',
    },
    ...overrides,
  });

  const createMockFollowUpData = (
    additionalItems: TOrderFollowUp[] = [],
  ): TOrderFollowUp[] => [
    {
      step: 'VALIDATING' as TOrderFollowUpStep,
      status: 'DOING' as TOrderFollowUpStatus,
      history: [
        {
          date: '2023-01-01T10:00:00Z',
          description: 'Order validation started',
          label: TOrderFollowUpLabel.ORDER_STARTED,
        },
      ],
    },
    {
      step: 'DELIVERING' as TOrderFollowUpStep,
      status: 'TODO' as TOrderFollowUpStatus,
      history: [],
    },
    ...additionalItems,
  ];

  // Helper functions
  const mockApiSuccess = (data: unknown) => {
    vi.mocked(v6.get).mockResolvedValue({ data });
  };

  const mockApiError = (error: Error) => {
    vi.mocked(v6.get).mockRejectedValue(error);
  };

  const mockSequentialApiCalls = (successData: unknown[], error?: Error) => {
    if (error) {
      vi.mocked(v6.get)
        .mockResolvedValueOnce({ data: successData[0] })
        .mockRejectedValueOnce(error);
    } else {
      successData.forEach((data) => {
        vi.mocked(v6.get).mockResolvedValueOnce({ data });
      });
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getOrderFollowUp', () => {
    it('should fetch order follow up successfully', async () => {
      const mockOrderId = 123;
      const mockFollowUpData = createMockFollowUpData();

      mockApiSuccess(mockFollowUpData);

      const result = await getOrderFollowUp(mockOrderId);

      expect(v6.get).toHaveBeenCalledWith('/me/order/123/followUp');
      expect(result).toEqual(mockFollowUpData);
    });

    it('should handle API errors', async () => {
      const mockOrderId = 123;
      const mockError = new Error('API Error');

      mockApiError(mockError);

      await expect(getOrderFollowUp(mockOrderId)).rejects.toThrow('API Error');
      expect(v6.get).toHaveBeenCalledWith('/me/order/123/followUp');
    });
  });

  describe('getOrderDetails', () => {
    it('should fetch order detail IDs successfully', async () => {
      const mockOrderId = 456;
      const mockDetailIds = [1, 2, 3];

      mockApiSuccess(mockDetailIds);

      const result = await getOrderDetails(mockOrderId);

      expect(v6.get).toHaveBeenCalledWith('/me/order/456/details');
      expect(result).toEqual(mockDetailIds);
    });

    it('should handle empty detail IDs', async () => {
      const mockOrderId = 456;
      const mockDetailIds: number[] = [];

      mockApiSuccess(mockDetailIds);

      const result = await getOrderDetails(mockOrderId);

      expect(v6.get).toHaveBeenCalledWith('/me/order/456/details');
      expect(result).toEqual([]);
    });
  });

  describe('getOrderDetailWithExtension', () => {
    it('should fetch order detail with extension successfully', async () => {
      const mockOrderId = 789;
      const mockDetailId = 111;
      const mockOrderDetail = createMockOrderDetail({
        orderDetailId: mockDetailId,
      });
      const mockExtension = createMockOrderDetailExtension();

      mockSequentialApiCalls([mockOrderDetail, mockExtension]);

      const result = await getOrderDetailWithExtension(
        mockOrderId,
        mockDetailId,
      );

      expect(v6.get).toHaveBeenCalledWith('/me/order/789/details/111');
      expect(v6.get).toHaveBeenCalledWith(
        '/me/order/789/details/111/extension',
      );
      expect(result).toEqual({
        ...mockOrderDetail,
        extension: mockExtension,
      });
    });

    it('should handle API error for order detail', async () => {
      const mockOrderId = 789;
      const mockDetailId = 111;
      const mockError = new Error('Order detail not found');

      mockApiError(mockError);

      await expect(
        getOrderDetailWithExtension(mockOrderId, mockDetailId),
      ).rejects.toThrow('Order detail not found');
      expect(v6.get).toHaveBeenCalledWith('/me/order/789/details/111');
    });

    it('should handle API error for order detail extension', async () => {
      const mockOrderId = 789;
      const mockDetailId = 111;
      const mockOrderDetail = createMockOrderDetail({
        orderDetailId: mockDetailId,
      });
      const mockError = new Error('Extension not found');

      mockSequentialApiCalls([mockOrderDetail], mockError);

      await expect(
        getOrderDetailWithExtension(mockOrderId, mockDetailId),
      ).rejects.toThrow('Extension not found');
      expect(v6.get).toHaveBeenCalledWith('/me/order/789/details/111');
      expect(v6.get).toHaveBeenCalledWith(
        '/me/order/789/details/111/extension',
      );
    });
  });
});
