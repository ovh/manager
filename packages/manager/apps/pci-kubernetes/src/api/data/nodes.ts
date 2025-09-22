import { v6 } from '@ovh-ux/manager-core-api';

type TRawNode = {
  createdAt: string;
  deployedAt: string;
  flavor: string;
  id: string;
  instanceId: string;
  isUpToDate: boolean;
  name: string;
  nodepoolId: string;
  projectId: string;
  status: 'READY' | 'DEPLOYING' | 'DELETING' | 'ERROR' | 'UPDATING';
  updatedAt: string;
  version: string;
};

export type TNode = TRawNode & {
  formattedFlavor: string;
  billingType: 'hourly' | 'monthly' | 'monthly_pending';
  canSwitchToMonthly: boolean;
  search?: string;
};

export const getNodes = async (
  projectId: string,
  clusterId: string,
  nodePoolId: string,
): Promise<TNode[]> => {
  const { data: items } = await v6.get<TRawNode[]>(
    `/cloud/project/${projectId}/kube/${clusterId}/nodepool/${nodePoolId}/nodes`,
  );

  return items.map((item) => ({
    ...item,
    formattedFlavor: item.flavor,
    billingType: 'monthly',
    canSwitchToMonthly: false,
  }));
};

export const deleteNode = async (projectId: string, clusterId: string, nodeId: string) =>
  v6.delete(`/cloud/project/${projectId}/kube/${clusterId}/node/${nodeId}`);
