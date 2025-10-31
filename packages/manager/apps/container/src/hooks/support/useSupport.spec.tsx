import { describe, it, vi } from 'vitest';
import { waitFor } from '@testing-library/react';
import { useSupport } from './useSupport';

vi.mock('@/container/common/urls-constants', () => ({
  useURL: vi.fn(() => ({
    get: vi.fn((key) => `https://support.ovhcloud.com/${key}`),
  })),
}));

describe('useSupport', () => {
  it('returns the initial user from the environment', async () => {
    const ticketLink = useSupport();

    await waitFor(() => {
      expect(ticketLink.url).toEqual('https://support.ovhcloud.com/tickets');
    });
  });
});