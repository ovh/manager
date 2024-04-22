import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  useGatewayCatalog,
  useGateways,
  useGatewayByRegion,
} from './useGateway';

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

  it('should fetch project gateway by region', async () => {
    const projectId = '123';
    const regionName = 'GRA';
    const gateways = [{ id: 1 }, { id: 2 }];
    vi.mocked(v6.get).mockResolvedValue({ data: gateways });
    const { result } = renderHook(
      () => useGatewayByRegion(projectId, regionName),
      {
        wrapper,
      },
    );
    expect(result.current.isFetching).toBe(true);
    expect(result.current.isPending).toBe(true);
    await waitFor(() => result.current.isSuccess);
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${regionName}/gateway`,
    );
    await waitFor(() => result.current.isFetching === false);
    expect(result.current.isPending).toBe(false);
    expect(result.current.data).toEqual([
      { id: 1, region: regionName },
      { id: 2, region: regionName },
    ]);
  });

  it('should fetch gateway catalog', async () => {
    const ovhSubsidiary = 'foo';
    const productName = 'bar';
    vi.mocked(v6.get).mockResolvedValue({ data: null });
    const { result } = renderHook(
      () => useGatewayCatalog(ovhSubsidiary, productName),
      {
        wrapper,
      },
    );
    expect(result.current.isFetching).toBe(true);
    expect(result.current.isPending).toBe(true);
    await waitFor(() => result.current.isSuccess);
    expect(v6.get).toHaveBeenCalledWith(`/order/catalog/public/cloud`, {
      params: { ovhSubsidiary, productName },
    });
    await waitFor(() => result.current.isFetching === false);
    expect(result.current.isPending).toBe(false);
  });
});
