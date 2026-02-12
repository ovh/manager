import { describe, expect, it, vi } from 'vitest';

import { v6 } from '@ovh-ux/manager-core-api';

import {
  TL7Policy,
  createPolicy,
  deletePolicy,
  getL7Policies,
  getPolicy,
  updatePolicy,
} from './l7Policies';
import {
  LoadBalancerOperatingStatusEnum,
  LoadBalancerProvisioningStatusEnum,
} from './load-balancer';

describe('l7Policies API', () => {
  const projectId = 'test-project';
  const region = 'test-region';
  const listenerId = 'test-listener';
  const policyId = 'test-policy';
  const policy: TL7Policy = {
    id: 'test-policy',
    name: 'Test Policy',
    description: 'Test Description',
    operatingStatus: LoadBalancerOperatingStatusEnum.ONLINE,
    provisioningStatus: LoadBalancerProvisioningStatusEnum.ACTIVE,
    redirectHttpCode: 301,
    redirectPoolId: null,
    redirectPrefix: null,
    redirectUrl: null,
    action: 'REDIRECT_TO_URL',
    position: 1,
    listenerId: 'test-listener',
  };

  it('should fetch L7 policies', async () => {
    const mockData = [policy];
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });

    const result = await getL7Policies(projectId, listenerId, region);
    expect(result).toEqual(mockData);
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy?listenerId=${listenerId}`,
    );
  });

  it('should fetch a single policy', async () => {
    vi.mocked(v6.get).mockResolvedValue({ data: policy });

    const result = await getPolicy(projectId, region, policyId);
    expect(result).toEqual(policy);
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy/${policyId}`,
    );
  });

  it('should delete a policy', async () => {
    const mockData = { success: true };
    vi.mocked(v6.delete).mockResolvedValue({ data: mockData });

    const result = await deletePolicy(projectId, region, policyId);
    expect(result).toEqual(mockData);
    expect(v6.delete).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy/${policyId}`,
    );
  });

  it('should create a policy', async () => {
    const mockData = { id: 'new-policy' };
    vi.mocked(v6.post).mockResolvedValue({ data: mockData });

    const result = await createPolicy(projectId, region, listenerId, policy);
    expect(result).toEqual(mockData);
    expect(v6.post).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy`,
      {
        listenerId,
        ...policy,
      },
    );
  });

  it('should update a policy', async () => {
    const mockData = { success: true };
    vi.mocked(v6.put).mockResolvedValue({ data: mockData });

    const result = await updatePolicy(projectId, region, policy);
    expect(result).toEqual(mockData);
    expect(v6.put).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy/${policy.id}`,
      {
        name: policy.name,
        position: policy.position,
        action: policy.action,
        redirectHttpCode: policy.redirectHttpCode,
        redirectPoolId: policy.redirectPoolId,
        redirectPrefix: policy.redirectPrefix,
        redirectUrl: policy.redirectUrl,
      },
    );
  });
});
