import { beforeEach, describe, expect, it, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getCreditBalance, getStartupProgram } from './credit';

const mockV6Get = vi.mocked(v6.get);

describe('credit API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCreditBalance', () => {
    it('should fetch credit balance successfully', async () => {
      const mockResponse = {
        data: ['CREDIT_CARD', 'STARTUP_PROGRAM', 'PAYPAL'],
      };
      mockV6Get.mockResolvedValueOnce(mockResponse);

      const result = await getCreditBalance();

      expect(result).toEqual(['CREDIT_CARD', 'STARTUP_PROGRAM', 'PAYPAL']);
      expect(mockV6Get).toHaveBeenCalledWith('/me/credit/balance');
      expect(mockV6Get).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no credit balance available', async () => {
      const mockResponse = {
        data: [],
      };
      mockV6Get.mockResolvedValueOnce(mockResponse);

      const result = await getCreditBalance();

      expect(result).toEqual([]);
      expect(mockV6Get).toHaveBeenCalledWith('/me/credit/balance');
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API Error');
      mockV6Get.mockRejectedValueOnce(mockError);

      await expect(getCreditBalance()).rejects.toThrow('API Error');
      expect(mockV6Get).toHaveBeenCalledWith('/me/credit/balance');
    });

    it('should handle different credit balance data structures', async () => {
      const mockResponse = {
        data: ['CREDIT_CARD'],
      };
      mockV6Get.mockResolvedValueOnce(mockResponse);

      const result = await getCreditBalance();

      expect(result).toEqual(['CREDIT_CARD']);
      expect(mockV6Get).toHaveBeenCalledWith('/me/credit/balance');
    });

    it('should handle network errors', async () => {
      const mockError = new Error('Network Error');
      mockV6Get.mockRejectedValueOnce(mockError);

      await expect(getCreditBalance()).rejects.toThrow('Network Error');
      expect(mockV6Get).toHaveBeenCalledWith('/me/credit/balance');
    });

    it('should handle timeout errors', async () => {
      const mockError = new Error('Request timeout');
      mockV6Get.mockRejectedValueOnce(mockError);

      await expect(getCreditBalance()).rejects.toThrow('Request timeout');
      expect(mockV6Get).toHaveBeenCalledWith('/me/credit/balance');
    });
  });

  describe('getStartupProgram', () => {
    it('should fetch startup program data successfully', async () => {
      const mockResponse = {
        data: {
          amount: {
            value: 100,
            currencyCode: 'EUR',
            text: '100.00 €',
          },
          status: 'ACTIVE',
        },
      };
      mockV6Get.mockResolvedValueOnce(mockResponse);

      const result = await getStartupProgram();

      expect(result).toEqual({
        amount: {
          value: 100,
          currencyCode: 'EUR',
          text: '100.00 €',
        },
        status: 'ACTIVE',
      });
      expect(mockV6Get).toHaveBeenCalledWith(
        '/me/credit/balance/STARTUP_PROGRAM',
      );
      expect(mockV6Get).toHaveBeenCalledTimes(1);
    });

    it('should handle null startup program data', async () => {
      const mockResponse = {
        data: null,
      };
      mockV6Get.mockResolvedValueOnce(mockResponse);

      const result = await getStartupProgram();

      expect(result).toBeNull();
      expect(mockV6Get).toHaveBeenCalledWith(
        '/me/credit/balance/STARTUP_PROGRAM',
      );
    });

    it('should handle empty startup program data', async () => {
      const mockResponse = {
        data: {},
      };
      mockV6Get.mockResolvedValueOnce(mockResponse);

      const result = await getStartupProgram();

      expect(result).toEqual({});
      expect(mockV6Get).toHaveBeenCalledWith(
        '/me/credit/balance/STARTUP_PROGRAM',
      );
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('Startup Program API Error');
      mockV6Get.mockRejectedValueOnce(mockError);

      await expect(getStartupProgram()).rejects.toThrow(
        'Startup Program API Error',
      );
      expect(mockV6Get).toHaveBeenCalledWith(
        '/me/credit/balance/STARTUP_PROGRAM',
      );
    });

    it('should handle different startup program data structures', async () => {
      const mockResponse = {
        data: {
          balance: 50,
          currency: 'USD',
          isActive: true,
        },
      };
      mockV6Get.mockResolvedValueOnce(mockResponse);

      const result = await getStartupProgram();

      expect(result).toEqual({
        balance: 50,
        currency: 'USD',
        isActive: true,
      });
      expect(mockV6Get).toHaveBeenCalledWith(
        '/me/credit/balance/STARTUP_PROGRAM',
      );
    });

    it('should handle network errors', async () => {
      const mockError = new Error('Network Error');
      mockV6Get.mockRejectedValueOnce(mockError);

      await expect(getStartupProgram()).rejects.toThrow('Network Error');
      expect(mockV6Get).toHaveBeenCalledWith(
        '/me/credit/balance/STARTUP_PROGRAM',
      );
    });

    it('should handle timeout errors', async () => {
      const mockError = new Error('Request timeout');
      mockV6Get.mockRejectedValueOnce(mockError);

      await expect(getStartupProgram()).rejects.toThrow('Request timeout');
      expect(mockV6Get).toHaveBeenCalledWith(
        '/me/credit/balance/STARTUP_PROGRAM',
      );
    });
  });
});
