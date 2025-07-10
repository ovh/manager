import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import {
  usePaymentChallenge,
  TPaymentChallengeParams,
} from './usePaymentChallenge';
import { challengePaymentMethod } from '@/data/api/payment/payment-challenge';
import { TChallengeStatus } from '@/data/types/payment/payment-challenge.type';
import { createWrapper } from '@/wrapperRenders';

// Mock the API function
vi.mock('@/data/api/payment/payment-challenge', () => ({
  challengePaymentMethod: vi.fn(),
}));

describe('usePaymentChallenge', () => {
  const mockChallengePaymentMethod = vi.mocked(challengePaymentMethod);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Hook initialization', () => {
    it('should initialize with correct default state', () => {
      // Arrange
      const wrapper = createWrapper();

      // Act
      const { result } = renderHook(() => usePaymentChallenge(), {
        wrapper,
      });

      // Assert
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
      expect(result.current.isError).toBe(false);
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.status).toBe('idle');
      expect(typeof result.current.mutate).toBe('function');
      expect(typeof result.current.mutateAsync).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });

    it('should provide mutate function', () => {
      // Arrange
      const wrapper = createWrapper();

      // Act
      const { result } = renderHook(() => usePaymentChallenge(), {
        wrapper,
      });

      // Assert
      expect(result.current.mutate).toBeDefined();
      expect(typeof result.current.mutate).toBe('function');
    });

    it('should provide mutateAsync function', () => {
      // Arrange
      const wrapper = createWrapper();

      // Act
      const { result } = renderHook(() => usePaymentChallenge(), {
        wrapper,
      });

      // Assert
      expect(result.current.mutateAsync).toBeDefined();
      expect(typeof result.current.mutateAsync).toBe('function');
    });
  });

  describe('Successful mutation', () => {
    it('should handle successful challenge submission', async () => {
      // Arrange
      const wrapper = createWrapper();
      const mockParams: TPaymentChallengeParams = {
        paymentMethodId: '123456',
        challenge: '654321',
      };
      const expectedResult: TChallengeStatus = 'success';
      mockChallengePaymentMethod.mockResolvedValue(expectedResult);

      const { result } = renderHook(() => usePaymentChallenge(), {
        wrapper,
      });

      // Act
      act(() => {
        result.current.mutate(mockParams);
      });

      // Assert - Wait for the mutation to complete
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBe(expectedResult);
      expect(result.current.error).toBeNull();
      expect(result.current.isError).toBe(false);
      expect(result.current.isPending).toBe(false);
      expect(result.current.status).toBe('success');
      expect(mockChallengePaymentMethod).toHaveBeenCalledWith(
        mockParams.paymentMethodId,
        mockParams.challenge,
      );
      expect(mockChallengePaymentMethod).toHaveBeenCalledTimes(1);
    });

    it('should handle successful challenge with mutateAsync', async () => {
      // Arrange
      const wrapper = createWrapper();
      const mockParams: TPaymentChallengeParams = {
        paymentMethodId: 'payment-123',
        challenge: 'challenge-456',
      };
      const expectedResult: TChallengeStatus = 'success';
      mockChallengePaymentMethod.mockResolvedValue(expectedResult);

      const { result } = renderHook(() => usePaymentChallenge(), {
        wrapper,
      });

      // Act
      const mutationResult = await act(() =>
        result.current.mutateAsync(mockParams),
      );

      // Assert
      expect(mutationResult).toBe(expectedResult);
      // Wait for the state to be updated
      await waitFor(() => {
        expect(result.current.data).toBe(expectedResult);
      });
      expect(result.current.isSuccess).toBe(true);
      expect(mockChallengePaymentMethod).toHaveBeenCalledWith(
        mockParams.paymentMethodId,
        mockParams.challenge,
      );
    });

    it('should handle deactivated status', async () => {
      // Arrange
      const wrapper = createWrapper();
      const mockParams: TPaymentChallengeParams = {
        paymentMethodId: '789012',
        challenge: '123456',
      };
      const expectedResult: TChallengeStatus = 'deactivated';
      mockChallengePaymentMethod.mockResolvedValue(expectedResult);

      const { result } = renderHook(() => usePaymentChallenge(), {
        wrapper,
      });

      // Act
      act(() => {
        result.current.mutate(mockParams);
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBe(expectedResult);
      expect(result.current.error).toBeNull();
      expect(result.current.isError).toBe(false);
      expect(mockChallengePaymentMethod).toHaveBeenCalledWith(
        mockParams.paymentMethodId,
        mockParams.challenge,
      );
    });

    it('should handle retry status', async () => {
      // Arrange
      const wrapper = createWrapper();
      const mockParams: TPaymentChallengeParams = {
        paymentMethodId: 'retry-payment-id',
        challenge: 'retry-challenge',
      };
      const expectedResult: TChallengeStatus = 'retry';
      mockChallengePaymentMethod.mockResolvedValue(expectedResult);

      const { result } = renderHook(() => usePaymentChallenge(), {
        wrapper,
      });

      // Act
      act(() => {
        result.current.mutate(mockParams);
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBe(expectedResult);
      expect(result.current.error).toBeNull();
      expect(result.current.isError).toBe(false);
      expect(mockChallengePaymentMethod).toHaveBeenCalledWith(
        mockParams.paymentMethodId,
        mockParams.challenge,
      );
    });
  });

  describe('Failed mutation', () => {
    it('should handle mutation errors', async () => {
      // Arrange
      const wrapper = createWrapper();
      const mockParams: TPaymentChallengeParams = {
        paymentMethodId: 'error-payment-id',
        challenge: 'error-challenge',
      };
      const mockError = new Error('Network error');
      mockChallengePaymentMethod.mockRejectedValue(mockError);

      const { result } = renderHook(() => usePaymentChallenge(), {
        wrapper,
      });

      // Act
      act(() => {
        result.current.mutate(mockParams);
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBe(mockError);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isPending).toBe(false);
      expect(result.current.status).toBe('error');
      expect(mockChallengePaymentMethod).toHaveBeenCalledWith(
        mockParams.paymentMethodId,
        mockParams.challenge,
      );
    });

    it('should handle mutateAsync errors', async () => {
      // Arrange
      const wrapper = createWrapper();
      const mockParams: TPaymentChallengeParams = {
        paymentMethodId: 'async-error-id',
        challenge: 'async-error-challenge',
      };
      const mockError = new Error('Async network error');
      mockChallengePaymentMethod.mockRejectedValue(mockError);

      const { result } = renderHook(() => usePaymentChallenge(), {
        wrapper,
      });

      // Act & Assert
      await expect(result.current.mutateAsync(mockParams)).rejects.toThrow(
        'Async network error',
      );

      // Verify the API was called
      expect(mockChallengePaymentMethod).toHaveBeenCalledWith(
        mockParams.paymentMethodId,
        mockParams.challenge,
      );
      expect(mockChallengePaymentMethod).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors with specific error objects', async () => {
      // Arrange
      const wrapper = createWrapper();
      const mockParams: TPaymentChallengeParams = {
        paymentMethodId: 'api-error-id',
        challenge: 'api-error-challenge',
      };
      const mockApiError = {
        status: 400,
        message: 'Bad Request',
        data: { code: 'INVALID_CHALLENGE' },
      };
      mockChallengePaymentMethod.mockRejectedValue(mockApiError);

      const { result } = renderHook(() => usePaymentChallenge(), {
        wrapper,
      });

      // Act
      act(() => {
        result.current.mutate(mockParams);
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockApiError);
      expect(result.current.data).toBeUndefined();
      expect(result.current.isSuccess).toBe(false);
    });
  });

  describe('Mutation with callbacks', () => {
    it('should call onSuccess callback when mutation succeeds', async () => {
      // Arrange
      const wrapper = createWrapper();
      const mockParams: TPaymentChallengeParams = {
        paymentMethodId: 'success-callback-id',
        challenge: 'success-callback-challenge',
      };
      const expectedResult: TChallengeStatus = 'success';
      const onSuccessMock = vi.fn();
      mockChallengePaymentMethod.mockResolvedValue(expectedResult);

      const { result } = renderHook(() => usePaymentChallenge(), {
        wrapper,
      });

      // Act
      act(() => {
        result.current.mutate(mockParams, {
          onSuccess: onSuccessMock,
        });
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccessMock).toHaveBeenCalledWith(
        expectedResult,
        mockParams,
        undefined,
      );
      expect(onSuccessMock).toHaveBeenCalledTimes(1);
    });

    it('should call onError callback when mutation fails', async () => {
      // Arrange
      const wrapper = createWrapper();
      const mockParams: TPaymentChallengeParams = {
        paymentMethodId: 'error-callback-id',
        challenge: 'error-callback-challenge',
      };
      const mockError = new Error('Callback error test');
      const onErrorMock = vi.fn();
      mockChallengePaymentMethod.mockRejectedValue(mockError);

      const { result } = renderHook(() => usePaymentChallenge(), {
        wrapper,
      });

      // Act
      act(() => {
        result.current.mutate(mockParams, {
          onError: onErrorMock,
        });
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(onErrorMock).toHaveBeenCalledWith(
        mockError,
        mockParams,
        undefined,
      );
      expect(onErrorMock).toHaveBeenCalledTimes(1);
    });

    it('should call onSettled callback regardless of mutation outcome', async () => {
      // Arrange
      const wrapper = createWrapper();
      const mockParams: TPaymentChallengeParams = {
        paymentMethodId: 'settled-callback-id',
        challenge: 'settled-callback-challenge',
      };
      const expectedResult: TChallengeStatus = 'success';
      const onSettledMock = vi.fn();
      mockChallengePaymentMethod.mockResolvedValue(expectedResult);

      const { result } = renderHook(() => usePaymentChallenge(), {
        wrapper,
      });

      // Act
      act(() => {
        result.current.mutate(mockParams, {
          onSettled: onSettledMock,
        });
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSettledMock).toHaveBeenCalledWith(
        expectedResult,
        null,
        mockParams,
        undefined,
      );
      expect(onSettledMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Reset functionality', () => {
    it('should reset mutation state', async () => {
      // Arrange
      const wrapper = createWrapper();
      const mockParams: TPaymentChallengeParams = {
        paymentMethodId: 'reset-test-id',
        challenge: 'reset-test-challenge',
      };
      const expectedResult: TChallengeStatus = 'success';
      mockChallengePaymentMethod.mockResolvedValue(expectedResult);

      const { result } = renderHook(() => usePaymentChallenge(), {
        wrapper,
      });

      // First mutation
      act(() => {
        result.current.mutate(mockParams);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Verify success state
      expect(result.current.data).toBe(expectedResult);
      expect(result.current.isSuccess).toBe(true);

      // Act - Reset
      act(() => {
        result.current.reset();
      });

      // Assert - State should be reset (wait for the reset to complete)
      await waitFor(() => {
        expect(result.current.status).toBe('idle');
      });
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
      expect(result.current.isError).toBe(false);
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });
  });

  describe('Multiple mutations', () => {
    it('should handle multiple sequential mutations', async () => {
      // Arrange
      const wrapper = createWrapper();
      const firstParams: TPaymentChallengeParams = {
        paymentMethodId: 'first-id',
        challenge: 'first-challenge',
      };
      const secondParams: TPaymentChallengeParams = {
        paymentMethodId: 'second-id',
        challenge: 'second-challenge',
      };
      const firstResult: TChallengeStatus = 'retry';
      const secondResult: TChallengeStatus = 'success';

      const { result } = renderHook(() => usePaymentChallenge(), {
        wrapper,
      });

      // First mutation
      mockChallengePaymentMethod.mockResolvedValueOnce(firstResult);
      act(() => {
        result.current.mutate(firstParams);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBe(firstResult);

      // Second mutation
      mockChallengePaymentMethod.mockResolvedValueOnce(secondResult);
      act(() => {
        result.current.mutate(secondParams);
      });

      await waitFor(() => {
        expect(result.current.data).toBe(secondResult);
      });

      expect(result.current.isSuccess).toBe(true);
      expect(mockChallengePaymentMethod).toHaveBeenCalledTimes(2);
      expect(mockChallengePaymentMethod).toHaveBeenNthCalledWith(
        1,
        firstParams.paymentMethodId,
        firstParams.challenge,
      );
      expect(mockChallengePaymentMethod).toHaveBeenNthCalledWith(
        2,
        secondParams.paymentMethodId,
        secondParams.challenge,
      );
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string parameters', async () => {
      // Arrange
      const wrapper = createWrapper();
      const mockParams: TPaymentChallengeParams = {
        paymentMethodId: '',
        challenge: '',
      };
      const expectedResult: TChallengeStatus = 'retry';
      mockChallengePaymentMethod.mockResolvedValue(expectedResult);

      const { result } = renderHook(() => usePaymentChallenge(), {
        wrapper,
      });

      // Act
      act(() => {
        result.current.mutate(mockParams);
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBe(expectedResult);
      expect(mockChallengePaymentMethod).toHaveBeenCalledWith('', '');
    });

    it('should handle special characters in parameters', async () => {
      // Arrange
      const wrapper = createWrapper();
      const mockParams: TPaymentChallengeParams = {
        paymentMethodId: 'payment-id!@#$%^&*()',
        challenge: 'challenge!@#$%^&*()',
      };
      const expectedResult: TChallengeStatus = 'success';
      mockChallengePaymentMethod.mockResolvedValue(expectedResult);

      const { result } = renderHook(() => usePaymentChallenge(), {
        wrapper,
      });

      // Act
      act(() => {
        result.current.mutate(mockParams);
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBe(expectedResult);
      expect(mockChallengePaymentMethod).toHaveBeenCalledWith(
        mockParams.paymentMethodId,
        mockParams.challenge,
      );
    });
  });

  describe('Type safety', () => {
    it('should accept correct parameter types', () => {
      // Arrange
      const wrapper = createWrapper();
      const { result } = renderHook(() => usePaymentChallenge(), {
        wrapper,
      });

      const validParams: TPaymentChallengeParams = {
        paymentMethodId: 'test-id',
        challenge: 'test-challenge',
      };

      // Act & Assert - This should compile without TypeScript errors
      expect(() => {
        result.current.mutate(validParams);
      }).not.toThrow();
    });

    it('should return correct TypeScript types', () => {
      // Arrange
      const wrapper = createWrapper();
      const { result } = renderHook(() => usePaymentChallenge(), {
        wrapper,
      });

      // Assert - TypeScript compilation will verify these types
      const { mutate, mutateAsync, data, error, isPending } = result.current;

      expect(mutate).toBeDefined();
      expect(mutateAsync).toBeDefined();
      expect(typeof isPending).toBe('boolean');

      // These are just type checks, the actual values will be tested elsewhere
      expect(data).toBeUndefined(); // Initial state
      expect(error).toBeNull(); // Initial state
    });
  });
});
