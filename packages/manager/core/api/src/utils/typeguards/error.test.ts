import { AxiosError, isAxiosError } from 'axios';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isApiErrorResponse, isMaxQuotaReachedError } from './error.typeguards';
import { TErrorClass, AxiosCustomError } from '../../types/error.type';

vi.mock('axios', () => ({
  isAxiosError: vi.fn(),
  AxiosError: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('error.typeguards', () => {
  describe('isApiErrorResponse', () => {
    it('should return true for valid API error response', () => {
      vi.mocked(isAxiosError).mockReturnValue(true);

      const mockError: AxiosCustomError = {
        response: {
          data: {
            class: 'SomeErrorClass',
            message: 'Some error message',
          },
        },
      } as AxiosCustomError;

      expect(isApiErrorResponse(mockError)).toBe(true);
    });

    it('should return false for non-Axios error', () => {
      const mockError = new Error('Regular error');

      expect(isApiErrorResponse(mockError)).toBe(false);
    });

    it('should return false for Axios error without response data', () => {
      const mockError = new AxiosError('Network error') as AxiosCustomError;

      expect(isApiErrorResponse(mockError)).toBe(false);
    });

    it('should return false for Axios error with missing message property', () => {
      const mockError: AxiosCustomError = {
        response: {
          data: {
            class: 'SomeErrorClass',
            // message is missing
          },
        },
      } as AxiosCustomError;

      expect(isApiErrorResponse(mockError)).toBe(false);
    });

    it('should return false for Axios error with non-object data', () => {
      const mockError: AxiosCustomError = {
        response: {
          data: 'string data' as any,
        },
      } as AxiosCustomError;

      expect(isApiErrorResponse(mockError)).toBe(false);
    });

    it('should return false for null/undefined error', () => {
      expect(isApiErrorResponse(null)).toBe(false);
      expect(isApiErrorResponse(undefined)).toBe(false);
    });
  });

  describe('isMaxQuotaReachedError', () => {
    it('should return true for error class containing MaxQuotaReached', () => {
      const mockError: AxiosCustomError = {
        response: {
          data: {
            class: `SomePrefix${TErrorClass.MaxQuotaReached}SomeSuffix`,
            message: 'Some error',
          },
        },
      } as AxiosCustomError;

      expect(isMaxQuotaReachedError(mockError)).toBe(true);
    });

    it('should return false for different error class', () => {
      const mockError: AxiosCustomError = {
        response: {
          data: {
            class: 'OtherErrorClass',
            message: 'Some error',
          },
        },
      } as AxiosCustomError;

      expect(isMaxQuotaReachedError(mockError)).toBe(false);
    });

    it('should return false for empty class string', () => {
      const mockError: AxiosCustomError = {
        response: {
          data: {
            class: '',
            message: 'Some error',
          },
        },
      } as AxiosCustomError;

      expect(isMaxQuotaReachedError(mockError)).toBe(false);
    });
  });
});
