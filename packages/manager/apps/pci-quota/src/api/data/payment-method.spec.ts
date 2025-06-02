import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getValidPaymenthMethodids } from './payment-method';

describe('getValidPaymenthMethodids', () => {
  it('fetches valid payment method ids successfully', async () => {
    // Arrange
    const mockData = ['pm-123', 'pm-456'];
    const url = '/me/payment/method?status=VALID';
    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockData });

    // Act
    const result = await getValidPaymenthMethodids();

    // Assert
    expect(v6.get).toHaveBeenCalledWith(url);
    expect(result).toEqual(mockData);
  });

  it('handles errors when fetching valid payment method ids', async () => {
    // Arrange
    const url = '/me/payment/method?status=VALID';
    const errorMessage = 'Network Error';
    vi.mocked(v6.get).mockRejectedValueOnce(new Error(errorMessage));

    // Act & Assert
    await expect(getValidPaymenthMethodids()).rejects.toThrow(errorMessage);
    expect(v6.get).toHaveBeenCalledWith(url);
  });
});
