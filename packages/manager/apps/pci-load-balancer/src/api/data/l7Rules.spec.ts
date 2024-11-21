import { describe, it, expect } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  getL7Rules,
  deleteL7Rule,
  createL7Rule,
  updateL7Rule,
  getL7Rule,
  TL7Rule,
} from './l7Rules';
import {
  LoadBalancerOperatingStatusEnum,
  LoadBalancerProvisioningStatusEnum,
} from './load-balancer';

describe('L7 Rules API', () => {
  const projectId = 'test-project';
  const region = 'test-region';
  const policyId = 'test-policy';
  const ruleId = 'test-rule';
  const rule: TL7Rule = {
    id: ruleId,
    operatingStatus: LoadBalancerOperatingStatusEnum.ONLINE,
    provisioningStatus: LoadBalancerProvisioningStatusEnum.ACTIVE,
    key: 'test-key',
    value: 'test-value',
    invert: false,
    ruleType: 'HOST_NAME',
    compareType: 'EQUAL_TO',
  };

  it('should get L7 rules', async () => {
    const mockData = [rule];
    (v6.get as any).mockResolvedValue({ data: mockData });

    const result = await getL7Rules(projectId, region, policyId);
    expect(result).toEqual(mockData);
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy/${policyId}/l7Rule`,
    );
  });

  it('should delete an L7 rule', async () => {
    const mockData = {};
    (v6.delete as any).mockResolvedValue({ data: mockData });

    const result = await deleteL7Rule(projectId, region, policyId, ruleId);
    expect(result).toEqual(mockData);
    expect(v6.delete).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy/${policyId}/l7Rule/${ruleId}`,
    );
  });

  it('should create an L7 rule', async () => {
    const mockData = rule;
    (v6.post as any).mockResolvedValue({ data: mockData });

    const result = await createL7Rule(projectId, region, policyId, rule);
    expect(result).toEqual(mockData);
    expect(v6.post).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy/${policyId}/l7Rule`,
      rule,
    );
  });

  it('should update an L7 rule', async () => {
    const updatedRule = { ...rule, value: 'updated-value' };
    const mockData = updatedRule;
    (v6.put as any).mockResolvedValue({ data: mockData });

    const result = await updateL7Rule(projectId, region, policyId, updatedRule);
    expect(result).toEqual(mockData);
    expect(v6.put).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy/${policyId}/l7Rule/${rule.id}`,
      {
        ruleType: updatedRule.ruleType,
        compareType: updatedRule.compareType,
        key: updatedRule.key,
        value: updatedRule.value,
        invert: updatedRule.invert,
      },
    );
  });

  it('should get a specific L7 rule', async () => {
    const mockData = rule;
    (v6.get as any).mockResolvedValue({ data: mockData });

    const result = await getL7Rule(projectId, region, policyId, ruleId);
    expect(result).toEqual(mockData);
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy/${policyId}/l7Rule/${ruleId}`,
    );
  });
});
