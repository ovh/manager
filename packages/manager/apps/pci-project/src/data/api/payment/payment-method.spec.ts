import { describe, it, expect, vi, beforeEach } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  getPaymentMethods,
  getPaymentMethod,
  getAvailablePaymentMethods,
  addPaymentMethod,
  finalizePaymentMethod,
  TPaymentMethodParams,
  TPaymentMethodFinalizationParams,
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
const mockV6Post = vi.mocked(v6.post);

describe('payment-method API', () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPaymentMethods', () => {
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
      paymentMethodId: 0,
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

  describe('getPaymentMethod', () => {
    it('should fetch a single payment method by ID', async () => {
      mockV6Get.mockResolvedValue(mockPaymentMethod);

      const result = await getPaymentMethod(789);

      expect(mockV6Get).toHaveBeenCalledWith('/me/payment/method/789');
      expect(result).toEqual(mockPaymentMethod);
    });

    it('should handle API errors for single payment method', async () => {
      const error = new Error('Payment method not found');
      mockV6Get.mockRejectedValue(error);

      await expect(getPaymentMethod(999)).rejects.toThrow(
        'Payment method not found',
      );
    });
  });

  describe('addPaymentMethod', () => {
    const mockRegisterPaymentMethod = {
      paymentMethodId: 123,
      url: 'https://example.com/payment-redirect',
      formSessionId: 'session123',
      integrationConfig: {
        clientKey: 'test-key',
        environment: 'test',
      },
    };

    it('should add payment method with all parameters', async () => {
      const params: TPaymentMethodParams = {
        default: true,
        paymentType: TPaymentMethodType.CREDIT_CARD,
        register: true,
        callbackUrl: {
          success: 'https://example.com/success',
          error: 'https://example.com/error',
        },
      };

      mockV6Post.mockResolvedValue({ data: mockRegisterPaymentMethod });

      const result = await addPaymentMethod(params);

      expect(mockV6Post).toHaveBeenCalledWith('/me/payment/method', params);
      expect(result).toEqual(mockRegisterPaymentMethod);
    });

    it('should add payment method with minimal parameters', async () => {
      const params: TPaymentMethodParams = {
        paymentType: TPaymentMethodType.PAYPAL,
      };

      mockV6Post.mockResolvedValue({ data: mockRegisterPaymentMethod });

      const result = await addPaymentMethod(params);

      expect(mockV6Post).toHaveBeenCalledWith('/me/payment/method', params);
      expect(result).toEqual(mockRegisterPaymentMethod);
    });

    it('should handle API errors when adding payment method', async () => {
      const params: TPaymentMethodParams = {
        paymentType: TPaymentMethodType.CREDIT_CARD,
      };
      const error = new Error('Failed to add payment method');
      mockV6Post.mockRejectedValue(error);

      await expect(addPaymentMethod(params)).rejects.toThrow(
        'Failed to add payment method',
      );
    });
  });

  describe('finalizePaymentMethod', () => {
    const mockFinalizedPaymentMethod = {
      ...mockPaymentMethod,
      status: TPaymentMethodStatus.VALID,
    };

    it('should finalize payment method successfully', async () => {
      const params: TPaymentMethodFinalizationParams = {
        formSessionId: 'session123',
      };

      mockV6Post.mockResolvedValue({ data: mockFinalizedPaymentMethod });

      const result = await finalizePaymentMethod(123, params);

      expect(mockV6Post).toHaveBeenCalledWith(
        '/me/payment/method/123/finalize',
        params,
      );
      expect(result).toEqual(mockFinalizedPaymentMethod);
    });

    it('should handle API errors when finalizing payment method', async () => {
      const params: TPaymentMethodFinalizationParams = {
        formSessionId: 'invalid-session',
      };
      const error = new Error('Failed to finalize payment method');
      mockV6Post.mockRejectedValue(error);

      await expect(finalizePaymentMethod(123, params)).rejects.toThrow(
        'Failed to finalize payment method',
      );
    });

    it('should finalize with different payment method IDs', async () => {
      const params: TPaymentMethodFinalizationParams = {
        formSessionId: 'session456',
      };

      mockV6Post.mockResolvedValue({ data: mockFinalizedPaymentMethod });

      await finalizePaymentMethod(456, params);

      expect(mockV6Post).toHaveBeenCalledWith(
        '/me/payment/method/456/finalize',
        params,
      );
    });
  });
});
