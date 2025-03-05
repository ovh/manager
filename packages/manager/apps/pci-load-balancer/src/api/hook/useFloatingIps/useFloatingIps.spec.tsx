import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { useFloatingIps } from './useFloatingIps';
import { useQueryWrapper } from '@/__tests__/wrapper';
import { getFloatingIps } from '@/api/data/floating-ips';
import { floatingIps } from '@/__mocks__/floatingIps';

vi.mock('@/api/data/floating-ips');

vi.mocked(getFloatingIps).mockResolvedValue(floatingIps);

vi.mock('@/api/hook/useAddons/useAddons');

describe('useFloatingIps', () => {
  it('should return floating ips for the region', async () => {
    const { result } = renderHook(
      () => useFloatingIps('projectId', 'projectId-test'),
      {
        wrapper: useQueryWrapper,
      },
    );

    await waitFor(() =>
      expect(result.current.data).toEqual([
        {
          id: 'floating-id2',
          ip: 'test-ip2',
          networkId: 'network-id2',
          status: 'active',
          associatedEntity: null,
        },
      ]),
    );
  });
});
