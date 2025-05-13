import { describe, expect, vi } from 'vitest';
import { apiClient } from '@ovh-ux/manager-core-api';
import { networkApi } from '@/data/api/network/network.api';

vi.mock('@ovh-ux/manager-core-api', () => {
  const get = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  return {
    apiClient: {
      v6: {
        get,
      },
    },
  };
});

describe('network api', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should call cloud project vrack apiv6 with project id', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    networkApi.getVrack('foo');
    expect(apiClient.v6.get).toHaveBeenCalledWith('/cloud/project/foo/vrack');
  });
  it('should call cloud project private networks apiv6 with project id', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    networkApi.getPrivateNetworks('foo');
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/foo/network/private',
    );
  });
  it('should call cloud project private networks subnets apiv6 with project and network id', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    networkApi.getSubnets('foo', 'bar');
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/foo/network/private/bar/subnet',
    );
  });
});
