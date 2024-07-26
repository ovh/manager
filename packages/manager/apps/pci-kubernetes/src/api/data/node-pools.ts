import { v6 } from '@ovh-ux/manager-core-api';

type TRawClusterNodePool = {
  id: string;
  projectId: string;
  name: string;
  flavor: string;
  status: 'READY' | 'UPDATING' | 'ERROR';
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
  | 'monthlyBilled'
  | 'createdAt'
  | 'status'
  | 'flavor'
  | 'minNodes'
  | 'maxNodes'
> & {
  formattedFlavor: string;
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
      } as TClusterNodePool),
  );
};
