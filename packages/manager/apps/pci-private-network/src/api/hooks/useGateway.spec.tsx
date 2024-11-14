import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { useGateways } from './useGateway';

vi.mock('@ovh-ux/manager-core-api');

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useGateway', () => {
  it('should fetch project gateways', async () => {
    const projectId = '123';
    const resources = ['a', 'b', 'c'];
    vi.mocked(v6.get).mockResolvedValue({ data: { resources } });
    const { result } = renderHook(() => useGateways(projectId), { wrapper });
    expect(result.current.isFetching).toBe(true);
    expect(result.current.isPending).toBe(true);
    await waitFor(() => result.current.isSuccess);
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/aggregated/gateway`,
    );
    await waitFor(() => result.current.isFetching === false);
    expect(result.current.isPending).toBe(false);
    expect(result.current.data).toBe(resources);
  });
});
