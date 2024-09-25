import { v6 } from '@ovh-ux/manager-core-api';
import { describe, it, vi } from 'vitest';
import { getLoadBalancers, TLoadBalancerResponse } from './load-balancer';
import { mockLoadBalancers } from '@/mocks';

describe('getLoadBalancers', () => {
  const projectId = 'test-project-id';
  const mockResponse: TLoadBalancerResponse = {
    resources: mockLoadBalancers,
    errors: [],
  };

  beforeEach(() => {
    vi.mocked(v6.get).mockResolvedValue({ data: mockResponse });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch load balancers for the given project ID', async () => {
    const result = await getLoadBalancers(projectId);
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/aggregated/loadbalancer`,
    );
    expect(result).toEqual(mockResponse);
  });

  it('should handle errors', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(v6.get).mockRejectedValue(new Error(errorMessage));

    await expect(getLoadBalancers(projectId)).rejects.toThrow(errorMessage);
  });
});
