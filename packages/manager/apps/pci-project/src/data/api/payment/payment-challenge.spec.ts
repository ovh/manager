import { describe, it, expect, vi, beforeEach } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { challengePaymentMethod } from './payment-challenge';
import { TChallengeStatus } from '@/data/types/payment/payment-challenge.type';

// Mock the API
vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    post: vi.fn(),
  },
}));

describe('challengePaymentMethod', () => {
  const mockV6Post = vi.mocked(v6.post);
  const mockPaymentMethodId = '123456';
  const mockChallenge = '123456';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Success scenarios', () => {
    it('should return "success" when API call succeeds', async () => {
      // Arrange
      mockV6Post.mockResolvedValue({ data: {} });

      // Act
      const result = await challengePaymentMethod(
        mockPaymentMethodId,
        mockChallenge,
      );

      // Assert
      expect(result).toBe('success' as TChallengeStatus);
      expect(
        mockV6Post,
      ).toHaveBeenCalledWith(
        `/me/payment/method/${mockPaymentMethodId}/challenge`,
        { challenge: mockChallenge },
      );
      expect(mockV6Post).toHaveBeenCalledTimes(1);
    });

    it('should call the correct endpoint with correct payload', async () => {
      // Arrange
      const customPaymentMethodId = 'custom-payment-id';
      const customChallenge = '654321';
      mockV6Post.mockResolvedValue({ data: {} });

      // Act
      await challengePaymentMethod(customPaymentMethodId, customChallenge);

      // Assert
      expect(
        mockV6Post,
      ).toHaveBeenCalledWith(
        `/me/payment/method/${customPaymentMethodId}/challenge`,
        { challenge: customChallenge },
      );
    });
  });

  describe('Deactivated scenarios', () => {
    it('should return "deactivated" when API returns 404 status', async () => {
      // Arrange
      const error = { status: 404, message: 'Not Found' };
      mockV6Post.mockRejectedValue(error);

      // Act
      const result = await challengePaymentMethod(
        mockPaymentMethodId,
        mockChallenge,
      );

      // Assert
      expect(result).toBe('deactivated' as TChallengeStatus);
      expect(
        mockV6Post,
      ).toHaveBeenCalledWith(
        `/me/payment/method/${mockPaymentMethodId}/challenge`,
        { challenge: mockChallenge },
      );
    });

    it('should return "deactivated" when API returns 409 status', async () => {
      // Arrange
      const error = { status: 409, message: 'Conflict' };
      mockV6Post.mockRejectedValue(error);

      // Act
      const result = await challengePaymentMethod(
        mockPaymentMethodId,
        mockChallenge,
      );

      // Assert
      expect(result).toBe('deactivated' as TChallengeStatus);
      expect(
        mockV6Post,
      ).toHaveBeenCalledWith(
        `/me/payment/method/${mockPaymentMethodId}/challenge`,
        { challenge: mockChallenge },
      );
    });
  });

  describe('Retry scenarios', () => {
    it('should return "retry" when API returns 400 status', async () => {
      // Arrange
      const error = { status: 400, message: 'Bad Request' };
      mockV6Post.mockRejectedValue(error);

      // Act
      const result = await challengePaymentMethod(
        mockPaymentMethodId,
        mockChallenge,
      );

      // Assert
      expect(result).toBe('retry' as TChallengeStatus);
    });

    it('should return "retry" when API returns 500 status', async () => {
      // Arrange
      const error = { status: 500, message: 'Internal Server Error' };
      mockV6Post.mockRejectedValue(error);

      // Act
      const result = await challengePaymentMethod(
        mockPaymentMethodId,
        mockChallenge,
      );

      // Assert
      expect(result).toBe('retry' as TChallengeStatus);
    });

    it('should return "retry" when API returns 401 status', async () => {
      // Arrange
      const error = { status: 401, message: 'Unauthorized' };
      mockV6Post.mockRejectedValue(error);

      // Act
      const result = await challengePaymentMethod(
        mockPaymentMethodId,
        mockChallenge,
      );

      // Assert
      expect(result).toBe('retry' as TChallengeStatus);
    });

    it('should return "retry" when API returns 403 status', async () => {
      // Arrange
      const error = { status: 403, message: 'Forbidden' };
      mockV6Post.mockRejectedValue(error);

      // Act
      const result = await challengePaymentMethod(
        mockPaymentMethodId,
        mockChallenge,
      );

      // Assert
      expect(result).toBe('retry' as TChallengeStatus);
    });

    it('should return "retry" when API returns 422 status', async () => {
      // Arrange
      const error = { status: 422, message: 'Unprocessable Entity' };
      mockV6Post.mockRejectedValue(error);

      // Act
      const result = await challengePaymentMethod(
        mockPaymentMethodId,
        mockChallenge,
      );

      // Assert
      expect(result).toBe('retry' as TChallengeStatus);
    });

    it('should return "retry" when API returns unknown status', async () => {
      // Arrange
      const error = { status: 999, message: 'Unknown Error' };
      mockV6Post.mockRejectedValue(error);

      // Act
      const result = await challengePaymentMethod(
        mockPaymentMethodId,
        mockChallenge,
      );

      // Assert
      expect(result).toBe('retry' as TChallengeStatus);
    });

    it('should return "retry" when error has no status property', async () => {
      // Arrange
      const error = { message: 'Network Error' };
      mockV6Post.mockRejectedValue(error);

      // Act
      const result = await challengePaymentMethod(
        mockPaymentMethodId,
        mockChallenge,
      );

      // Assert
      expect(result).toBe('retry' as TChallengeStatus);
    });

    it('should return "retry" when error is a string', async () => {
      // Arrange
      const error = 'Network connection failed';
      mockV6Post.mockRejectedValue(error);

      // Act
      const result = await challengePaymentMethod(
        mockPaymentMethodId,
        mockChallenge,
      );

      // Assert
      expect(result).toBe('retry' as TChallengeStatus);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty payment method ID', async () => {
      // Arrange
      mockV6Post.mockResolvedValue({ data: {} });

      // Act
      const result = await challengePaymentMethod('', mockChallenge);

      // Assert
      expect(result).toBe('success' as TChallengeStatus);
      expect(mockV6Post).toHaveBeenCalledWith('/me/payment/method//challenge', {
        challenge: mockChallenge,
      });
    });

    it('should handle empty challenge', async () => {
      // Arrange
      mockV6Post.mockResolvedValue({ data: {} });

      // Act
      const result = await challengePaymentMethod(mockPaymentMethodId, '');

      // Assert
      expect(result).toBe('success' as TChallengeStatus);
      expect(
        mockV6Post,
      ).toHaveBeenCalledWith(
        `/me/payment/method/${mockPaymentMethodId}/challenge`,
        { challenge: '' },
      );
    });

    it('should handle special characters in payment method ID', async () => {
      // Arrange
      const specialPaymentMethodId = 'payment-method-123!@#$%^&*()';
      mockV6Post.mockResolvedValue({ data: {} });

      // Act
      const result = await challengePaymentMethod(
        specialPaymentMethodId,
        mockChallenge,
      );

      // Assert
      expect(result).toBe('success' as TChallengeStatus);
      expect(
        mockV6Post,
      ).toHaveBeenCalledWith(
        `/me/payment/method/${specialPaymentMethodId}/challenge`,
        { challenge: mockChallenge },
      );
    });

    it('should handle special characters in challenge', async () => {
      // Arrange
      const specialChallenge = 'challenge-with-special-chars!@#$%^&*()';
      mockV6Post.mockResolvedValue({ data: {} });

      // Act
      const result = await challengePaymentMethod(
        mockPaymentMethodId,
        specialChallenge,
      );

      // Assert
      expect(result).toBe('success' as TChallengeStatus);
      expect(
        mockV6Post,
      ).toHaveBeenCalledWith(
        `/me/payment/method/${mockPaymentMethodId}/challenge`,
        { challenge: specialChallenge },
      );
    });
  });

  describe('Type safety', () => {
    it('should return correct TypeScript type for success', async () => {
      // Arrange
      mockV6Post.mockResolvedValue({ data: {} });

      // Act
      const result = await challengePaymentMethod(
        mockPaymentMethodId,
        mockChallenge,
      );

      // Assert - TypeScript compilation will verify the type
      const expectedStatus: TChallengeStatus = result;
      expect(expectedStatus).toBe('success');
    });

    it('should return correct TypeScript type for deactivated', async () => {
      // Arrange
      const error = { status: 404, message: 'Not Found' };
      mockV6Post.mockRejectedValue(error);

      // Act
      const result = await challengePaymentMethod(
        mockPaymentMethodId,
        mockChallenge,
      );

      // Assert - TypeScript compilation will verify the type
      const expectedStatus: TChallengeStatus = result;
      expect(expectedStatus).toBe('deactivated');
    });

    it('should return correct TypeScript type for retry', async () => {
      // Arrange
      const error = { status: 500, message: 'Internal Server Error' };
      mockV6Post.mockRejectedValue(error);

      // Act
      const result = await challengePaymentMethod(
        mockPaymentMethodId,
        mockChallenge,
      );

      // Assert - TypeScript compilation will verify the type
      const expectedStatus: TChallengeStatus = result;
      expect(expectedStatus).toBe('retry');
    });
  });
});
