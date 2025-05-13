import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, vi } from 'vitest';
import {
  TCreateNetworkWithGatewayParam,
  useCreateNetworkWithGateway,
  useNetworks,
  usePrivateNetworks,
} from './useNetworks';
import {
  createNetworkWithGateway,
  getNetworks,
  getPrivateNetworks,
  TNetwork,
  TNewNetworkWithGateway,
} from '@/api/data/networks';

vi.mock('@/api/data/networks', () => ({
  getNetworks: vi.fn(),
  getPrivateNetworks: vi.fn(),
  getNetworksUrl: vi.fn(),
  createNetworkWithGateway: vi.fn(),
}));

const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('useNetworks', () => {
  it('returns data when projectId and regionName are provided', async () => {
    vi.mocked(getNetworks).mockResolvedValueOnce([
      { id: '1', name: 'test' },
    ] as TNetwork[]);
    const { result } = renderHook(() => useNetworks('test', 'test'), {
      wrapper,
    });
    await waitFor(() =>
      expect(result.current.data).toEqual([{ id: '1', name: 'test' }]),
    );
    expect(getNetworks).toHaveBeenCalledWith('test', 'test');
  });
});

describe('usePrivateNetworks', () => {
  it('returns data when projectId and regionName are provided', async () => {
    vi.mocked(getPrivateNetworks).mockResolvedValueOnce([
      { id: '1', name: 'test' },
    ] as TNetwork[]);
    const { result } = renderHook(() => usePrivateNetworks('test', 'test'), {
      wrapper,
    });
    waitFor(() =>
      expect(result.current.data).toEqual([{ id: '1', name: 'test' }]),
    );
    expect(getPrivateNetworks).toHaveBeenCalledWith('test', 'test');
  });
});

describe('useCreateNetworkWithGateway', () => {
  it('calls createNetworkWithGateway on mutation', async ({ expect }) => {
    const params: TCreateNetworkWithGatewayParam = {
      projectId: 'test',
      regionName: 'test',
      onError: vi.fn(),
      onSuccess: vi.fn(),
    };
    const { result } = renderHook(() => useCreateNetworkWithGateway(params), {
      wrapper,
    });
    const newNetwork = ({
      name: 'test',
      description: 'test',
    } as unknown) as TNewNetworkWithGateway;
    vi.mocked(createNetworkWithGateway).mockResolvedValueOnce(newNetwork);
    await act(() => result.current.createNetworkWithGateway(newNetwork));
    expect(createNetworkWithGateway).toHaveBeenCalledWith(
      params.projectId,
      params.regionName,
      newNetwork,
    );
  });

  it('calls onSuccess when mutation is successful', async ({ expect }) => {
    const onSuccess = vi.fn();
    const params: TCreateNetworkWithGatewayParam = {
      projectId: 'test',
      regionName: 'test',
      onError: vi.fn(),
      onSuccess,
    };
    const { result } = renderHook(() => useCreateNetworkWithGateway(params), {
      wrapper,
    });
    const newNetwork = ({
      name: 'test',
      description: 'test',
    } as unknown) as TNewNetworkWithGateway;
    vi.mocked(createNetworkWithGateway).mockResolvedValueOnce(newNetwork);
    await act(() => result.current.createNetworkWithGateway(newNetwork));
    expect(onSuccess).toHaveBeenCalled();
  });

  it('calls onError when mutation fails', async ({ expect }) => {
    const onError = vi.fn();
    const params: TCreateNetworkWithGatewayParam = {
      projectId: 'test',
      regionName: 'test',
      onError,
      onSuccess: vi.fn(),
    };
    const { result } = renderHook(() => useCreateNetworkWithGateway(params), {
      wrapper,
    });
    const newNetwork = ({
      name: 'test',
      description: 'test',
    } as unknown) as TNewNetworkWithGateway;
    vi.mocked(createNetworkWithGateway).mockRejectedValueOnce(
      new Error('error'),
    );
    await act(() => result.current.createNetworkWithGateway(newNetwork));
    expect(onError).toHaveBeenCalled();
  });
});
