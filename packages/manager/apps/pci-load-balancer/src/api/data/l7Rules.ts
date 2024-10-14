import { v6 } from '@ovh-ux/manager-core-api';
import {
  LoadBalancerOperatingStatusEnum,
  LoadBalancerProvisioningStatusEnum,
} from '@/api/data/load-balancer';

export type TL7Rule = {
  id: string;
  operatingStatus: LoadBalancerOperatingStatusEnum;
  provisioningStatus: LoadBalancerProvisioningStatusEnum;
  key: string;
  value: string;
  invert: boolean;
  ruleType: string;
  compareType: string;
  search?: string;
};

export const getL7Rules = async (
  projectId: string,
  region: string,
  policyId: string,
): Promise<TL7Rule[]> => {
  const { data } = await v6.get<TL7Rule[]>(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy/${policyId}/l7Rule`,
  );
  return data;
};

export const deleteL7Rule = async (
  projectId: string,
  region: string,
  policyId: string,
  ruleId: string,
) => {
  const { data } = await v6.delete(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy/${policyId}/l7Rule/${ruleId}`,
  );
  return data;
};

export const createL7Rule = async (
  projectId: string,
  region: string,
  policyId: string,
  rule: TL7Rule,
) => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy/${policyId}/l7Rule`,
    rule,
  );
  return data;
};

export const updateL7Rule = async (
  projectId: string,
  region: string,
  policyId: string,
  rule: TL7Rule,
) => {
  const { data } = await v6.put(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy/${policyId}/l7Rule/${rule.id}`,
    {
      ruleType: rule.ruleType,
      compareType: rule.compareType,
      key: rule.key,
      value: rule.value,
      invert: rule.invert,
    },
  );
  return data;
};

export const getL7Rule = async (
  projectId: string,
  region: string,
  policyId: string,
  ruleId: string,
): Promise<TL7Rule> => {
  const { data } = await v6.get<TL7Rule>(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy/${policyId}/l7Rule/${ruleId}`,
  );
  return data;
};
