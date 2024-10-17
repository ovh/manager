import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useGetFloatingIps } from './useFloatingIps';
import { getFloatingIps, TFloatingIp } from '../data/floating-ips';
import { wrapper } from '@/wrapperRenders';

vi.mock('../data/floating-ips');

describe('useGetFloatingIps', () => {
  it('should fetch floating IPs successfully', async () => {
    const mockData = [{ id: '1', ip: '192.168.0.1' }] as TFloatingIp[];
    vi.mocked(getFloatingIps).mockResolvedValueOnce(mockData);

    const { result } = renderHook(
      () => useGetFloatingIps('project1', 'region1'),
      {
        wrapper,
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
  });
});
