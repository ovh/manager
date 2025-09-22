import { v6 } from '@ovh-ux/manager-core-api';

import { TCreateNodePoolParam } from '@/types';

type TRawClusterNodePool = {
  id: string;
  projectId: string;
  name: string;
  flavor: string;
  status: 'READY' | 'UPDATING' | 'DELETING' | 'INSTALLING' | 'ERROR';
  sizeStatus: string;
  autoscale: boolean;
  monthlyBilled: boolean;
  antiAffinity: boolean;
  desiredNodes: number;
  minNodes: number;
  maxNodes: number;
  currentNodes: number;
  availableNodes: number;
  upToDateNodes: number;
  createdAt: string;
  updatedAt: string;
  location?: string;
  availabilityZones?: string[];
  autoscaling: {
    scaleDownUtilizationThreshold: number;
    scaleDownUnneededTimeSeconds: number;
    scaleDownUnreadyTimeSeconds: number;
  };
  template: {
    metadata: {
      labels: Record<string, unknown>;
      annotations: Record<string, unknown>;
      finalizers: [];
    };
    spec: {
      unschedulable: boolean;
      taints: [];
    };
  };
};

export type TClusterNodePool = Pick<
  TRawClusterNodePool,
  | 'id'
  | 'name'
  | 'antiAffinity'
  | 'availableNodes'
  | 'desiredNodes'
  | 'autoscale'
  | 'availabilityZones'
  | 'monthlyBilled'
  | 'createdAt'
  | 'status'
  | 'flavor'
  | 'minNodes'
  | 'maxNodes'
  | 'location'
> & {
  formattedFlavor: string;
  search?: string;
};

export const getClusterNodePools = async (
  projectId: string,
  clusterId: string,
): Promise<TClusterNodePool[]> => {
  const { data: items } = await v6.get<TRawClusterNodePool[]>(
    `/cloud/project/${projectId}/kube/${clusterId}/nodepool`,
  );

  return items.map(
    (item) =>
      ({
        id: item.id,
        name: item.name,
        antiAffinity: item.antiAffinity,
        availableNodes: item.availableNodes,
        desiredNodes: item.desiredNodes,
        autoscale: item.autoscale,
        monthlyBilled: item.monthlyBilled,
        createdAt: item.createdAt,
        status: item.status,
        flavor: item.flavor,
        minNodes: item.minNodes,
        maxNodes: item.maxNodes,
        ...(item.availabilityZones && {
          availabilityZones: item.availabilityZones,
        }),
      }) as TClusterNodePool,
  );
};

export const deleteNodePool = async (projectId: string, clusterId: string, poolId: string) =>
  v6.delete(`/cloud/project/${projectId}/kube/${clusterId}/nodepool/${poolId}`);

export type TUpdateNodePoolSizeParam = {
  desiredNodes: number;
  minNodes?: number;
  maxNodes?: number;
  autoscale: boolean;
};

export const updateNodePoolSize = async (
  projectId: string,
  clusterId: string,
  poolId: string,
  param: TUpdateNodePoolSizeParam,
) => v6.put(`/cloud/project/${projectId}/kube/${clusterId}/nodepool/${poolId}`, param);

export const createNodePool = (projectId: string, clusterId: string, param: TCreateNodePoolParam) =>
  v6.post(`/cloud/project/${projectId}/kube/${clusterId}/nodepool`, param);
