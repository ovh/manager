import { AxiosError, isAxiosError } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiErrorClass, TApiCustomError } from '../../../types/error.type';
import { isApiCustomError, isMaxQuotaReachedError } from './error.guard';

vi.mock('axios', () => ({
  isAxiosError: vi.fn(),
  AxiosError: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Typeguard functions', () => {
  describe('isApiCustomError typeguard', () => {
    it('should return true for custom API error response', () => {
      vi.mocked(isAxiosError).mockReturnValue(true);

      const mockError: unknown = {
        response: {
          data: {
            class: 'SomeErrorClass',
            message: 'Some error message',
          },
        },
      };

      expect(isApiCustomError(mockError)).toBe(true);
    });

    it('should return false for non-Axios error', () => {
      const mockError = new Error('Regular error');

      expect(isApiCustomError(mockError)).toBe(false);
    });

    it('should return false for Axios error without response data', () => {
      const mockError = new AxiosError('Network error');

      expect(isApiCustomError(mockError)).toBe(false);
    });

    it('should return false for Axios error with missing message property', () => {
      const mockError: unknown = {
        response: {
          data: {
            class: 'SomeErrorClass',
            // message is missing
          },
        },
      };

      expect(isApiCustomError(mockError)).toBe(false);
    });

    it('should return false for Axios error with non-object data', () => {
      const mockError: unknown = {
        response: {
          data: 'string data',
        },
      };

      expect(isApiCustomError(mockError)).toBe(false);
    });

    it('should return false for null/undefined error', () => {
      expect(isApiCustomError(null)).toBe(false);
      expect(isApiCustomError(undefined)).toBe(false);
    });
  });

  describe('isMaxQuotaReachedError function', () => {
    it('should return true for error class containing MaxQuotaReached', () => {
      const mockError = {
        response: {
          data: {
            class: `SomePrefix${ApiErrorClass.MaxQuotaReached}SomeSuffix`,
            message: 'Some error',
          },
        },
      } as TApiCustomError;

      expect(isMaxQuotaReachedError(mockError)).toBe(true);
    });

    it('should return false for different error class', () => {
      const mockError = {
        response: {
          data: {
            class: 'OtherErrorClass',
            message: 'Some error',
          },
        },
      } as TApiCustomError;

      expect(isMaxQuotaReachedError(mockError)).toBe(false);
    });

    it('should return false for empty class string', () => {
      const mockError = {
        response: {
          data: {
            class: '',
            message: 'Some error',
          },
        },
      } as TApiCustomError;

      expect(isMaxQuotaReachedError(mockError)).toBe(false);
    });
  });
});
