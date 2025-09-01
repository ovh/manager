import { describe, it, expect, vi, beforeEach } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  getPaymentMethods,
  getAvailablePaymentMethods,
  TPaymentMethodParams,
} from './payment-method';
import {
  TUserPaymentMethod,
  TAvailablePaymentMethod,
  TPaymentMethodStatus,
  TPaymentMethodType,
  TPaymentMethodIntegration,
  TPaymentSubType,
} from '@/data/types/payment/payment-method.type';

vi.mock('@ovh-ux/manager-core-api');

const mockV6Get = vi.mocked(v6.get);

describe('payment-method API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPaymentMethods', () => {
    const mockPaymentMethod: TUserPaymentMethod = {
      billingContactId: 123,
      creationDate: '2023-01-01T00:00:00Z',
      default: true,
      description: 'Test payment method',
      expirationDate: '2025-12-31T23:59:59Z',
      formSessionId: 'session123',
      icon: {
        data: undefined,
        name: 'visa',
        url: 'https://example.com/visa.png',
      },
      integration: TPaymentMethodIntegration.COMPONENT,
      label: 'My Visa Card',
      lastUpdate: '2023-06-01T00:00:00Z',
      merchantId: 'merchant123',
      oneclick: true,
      paymentMeanId: 456,
      paymentMethodId: 789,
      paymentSubType: TPaymentSubType.VISA,
      paymentType: TPaymentMethodType.CREDIT_CARD,
      status: TPaymentMethodStatus.VALID,
    };

    it('should fetch payment methods without parameters', async () => {
      const mockResponse: TUserPaymentMethod[] = [mockPaymentMethod];
      mockV6Get.mockResolvedValue({ data: mockResponse });

      const result = await getPaymentMethods();

      expect(mockV6Get).toHaveBeenCalledWith('/me/payment/method', {
        headers: { 'x-pagination-mode': 'CachedObjectList-Pages' },
        params: undefined,
      });
      expect(result.data).toEqual(mockResponse);
    });

    it('should fetch payment methods with all parameters', async () => {
      const mockResponse: TUserPaymentMethod[] = [mockPaymentMethod];
      const params: TPaymentMethodParams = {
        default: true,
        status: TPaymentMethodStatus.VALID,
        paymentType: TPaymentMethodType.CREDIT_CARD,
      };
      mockV6Get.mockResolvedValue({ data: mockResponse });

      const result = await getPaymentMethods(params);

      expect(mockV6Get).toHaveBeenCalledWith('/me/payment/method', {
        headers: { 'x-pagination-mode': 'CachedObjectList-Pages' },
        params,
      });
      expect(result.data).toEqual(mockResponse);
    });

    it('should fetch payment methods with partial parameters', async () => {
      const mockResponse: TUserPaymentMethod[] = [mockPaymentMethod];
      const params: TPaymentMethodParams = {
        status: TPaymentMethodStatus.VALID,
      };
      mockV6Get.mockResolvedValue({ data: mockResponse });

      const result = await getPaymentMethods(params);

      expect(mockV6Get).toHaveBeenCalledWith('/me/payment/method', {
        headers: { 'x-pagination-mode': 'CachedObjectList-Pages' },
        params,
      });
      expect(result.data).toEqual(mockResponse);
    });

    it('should handle empty response', async () => {
      const mockResponse: TUserPaymentMethod[] = [];
      mockV6Get.mockResolvedValue({ data: mockResponse });

      const result = await getPaymentMethods();

      expect(result.data).toEqual([]);
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockV6Get.mockRejectedValue(error);

      await expect(getPaymentMethods()).rejects.toThrow('API Error');
    });
  });

  describe('getAvailablePaymentMethods', () => {
    const mockAvailablePaymentMethod: TAvailablePaymentMethod = {
      paymentMethodId: 1,
      formSessionId: 'session456',
      icon: {
        data: 'base64data',
        name: 'mastercard',
        url: 'https://example.com/mastercard.png',
      },
      integration: TPaymentMethodIntegration.REDIRECT,
      merchantId: 'merchant456',
      oneshot: false,
      organizationId: 'org123',
      paymentSubType: TPaymentSubType.MASTERCARD,
      paymentType: TPaymentMethodType.CREDIT_CARD,
      registerable: true,
      registerableWithTransaction: false,
    };

    it('should fetch available payment methods', async () => {
      const mockResponse: TAvailablePaymentMethod[] = [
        mockAvailablePaymentMethod,
      ];
      mockV6Get.mockResolvedValue({ data: mockResponse });

      const result = await getAvailablePaymentMethods();

      expect(mockV6Get).toHaveBeenCalledWith('/me/payment/availableMethods');
      expect(result.data).toEqual(mockResponse);
    });

    it('should handle multiple available payment methods', async () => {
      const mockResponse: TAvailablePaymentMethod[] = [
        mockAvailablePaymentMethod,
        {
          ...mockAvailablePaymentMethod,
          paymentSubType: TPaymentSubType.VISA,
          paymentType: TPaymentMethodType.PAYPAL,
        },
      ];
      mockV6Get.mockResolvedValue({ data: mockResponse });

      const result = await getAvailablePaymentMethods();

      expect(result.data).toHaveLength(2);
      expect(result.data).toEqual(mockResponse);
    });

    it('should handle empty available payment methods', async () => {
      const mockResponse: TAvailablePaymentMethod[] = [];
      mockV6Get.mockResolvedValue({ data: mockResponse });

      const result = await getAvailablePaymentMethods();

      expect(result.data).toEqual([]);
    });

    it('should handle API errors', async () => {
      const error = new Error('Available methods API Error');
      mockV6Get.mockRejectedValue(error);

      await expect(getAvailablePaymentMethods()).rejects.toThrow(
        'Available methods API Error',
      );
    });
  });
});
