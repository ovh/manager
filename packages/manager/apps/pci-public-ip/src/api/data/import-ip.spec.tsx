import { describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getImportsIPs } from '@/api/data/import-ip';

const failoverIpsMock = [
  {
    id: 'foo',
    routedTo: {
      serviceName: '123',
    },
  },
  {
    id: 'bar',
    routedTo: {
      serviceName: '000',
    },
  },
  {
    id: 'baz',
    routedTo: {
      serviceName: '123',
    },
  },
];

vi.mock('@ovh-ux/manager-core-api', () => {
  const mock = vi.fn(() =>
    Promise.resolve({
      data: failoverIpsMock,
    }),
  );
  return {
    fetchIcebergV6: mock,
  };
});

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('import ip', () => {
  it('should get failovers ips not routed to the project', async () => {
    const projectId = '123';
    expect(fetchIcebergV6).not.toHaveBeenCalled();
    const { result } = renderHook(() => getImportsIPs(projectId), { wrapper });
    expect(fetchIcebergV6).toHaveBeenCalledWith({
      route: '/ip?type=failover',
    });
    const ips = await result.current;
    expect(ips.length).toBe(1);
    expect(ips[0]).toBe(failoverIpsMock.find((ip) => ip.id === 'bar'));
  });
});
