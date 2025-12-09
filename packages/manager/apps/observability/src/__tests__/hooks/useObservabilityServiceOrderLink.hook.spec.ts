import { renderHook } from '@testing-library/react';
import JSURL from 'jsurl';
import { describe, expect, it, vi } from 'vitest';

import { useObservabilityServiceOrderLink } from '@/hooks/useObservabilityServiceOrderLink.hook';

const mockOrderBaseUrl = 'https://www.ovh.com/order/express';

vi.mock('@ovh-ux/manager-module-order', () => ({
  useOrderURL: () => mockOrderBaseUrl,
}));

describe('useObservabilityServiceOrderLink', () => {
  it('should return the order link with correct format and settings', () => {
    // Arrange
    const expectedSettings = JSURL.stringify({
      planCode: 'logs-account',
      productId: 'logs',
      region: 'gra',
    });

    // Act
    const { result } = renderHook(() => useObservabilityServiceOrderLink());

    // Assert
    expect(result.current).toBe(`${mockOrderBaseUrl}?products=~(${expectedSettings})`);
  });
});
