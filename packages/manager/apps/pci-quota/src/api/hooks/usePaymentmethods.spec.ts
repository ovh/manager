import { vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGetValidPaymentMethodIds } from './usePaymentmethods';
import { wrapper } from '@/wrapperRenders';
import { getValidPaymenthMethodids } from '../data/payment-method';

vi.mock('@/api/data/payment-method', () => ({
  getValidPaymenthMethodids: vi.fn(),
}));

describe('useGetValidPaymentMethodIds', () => {
  it('returns valid payment method ids', async () => {
    // Arrange
    const mockData = ['1', ' 2', '3'];
    vi.mocked(getValidPaymenthMethodids).mockResolvedValueOnce(mockData);

    // Act
    const { result } = renderHook(() => useGetValidPaymentMethodIds(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toEqual(mockData);
    expect(result.current.isValid).toBe(true);
  });

  it('returns invalid when no payment method ids', async () => {
    // Arrange
    vi.mocked(getValidPaymenthMethodids).mockResolvedValueOnce([]);

    // Act
    const { result } = renderHook(() => useGetValidPaymentMethodIds(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.data).toEqual([]);
    });
    expect(result.current.isValid).toEqual(false);
  });

  it('handles error state', async () => {
    // Arrange
    const errorMessage = 'Network Error';
    vi.mocked(getValidPaymenthMethodids).mockRejectedValue(
      new Error(errorMessage),
    );

    // Act
    const { result } = renderHook(() => useGetValidPaymentMethodIds(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Assert
    expect(result.current.isError).toBe(true);
  });
});
