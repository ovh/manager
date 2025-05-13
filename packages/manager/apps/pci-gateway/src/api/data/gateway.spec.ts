import { describe, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { deleteGateway, getAllAggregatedGateway } from '@/api/data/gateway';

vi.mock('@ovh-ux/manager-core-api', () => {
  const get = vi.fn(() => Promise.resolve({ data: {} }));
  const deleteFn = vi.fn(() => Promise.resolve({ data: {} }));
  const post = vi.fn(() => Promise.resolve({ data: {} }));
  return {
    v6: {
      get,
      delete: deleteFn,
      post,
    },
  };
});

describe('gateway api', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should get all aggregated gateway', async () => {
    expect(v6.get).not.toHaveBeenCalled();
    const projectId = '12345';
    getAllAggregatedGateway(projectId);
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/aggregated/gateway`,
    );
  });

  it('should delete gateway', async () => {
    expect(v6.delete).not.toHaveBeenCalled();
    const projectId = '12345';
    const regionName = 'EU';
    const gatewayId = 'abc';
    deleteGateway(projectId, regionName, gatewayId);
    expect(v6.delete).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${regionName}/gateway/${gatewayId}`,
    );
  });
});
