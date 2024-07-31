import { useMutation, useQuery } from '@tanstack/react-query';
import { PaginationState } from '@ovhcloud/manager-components';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useKubernetesCluster } from '@/api/hooks/useKubernetes';
import { useRegionFlavors } from '@/api/hooks/flavors';
import { deleteNode, getNodes, TNode } from '@/api/data/nodes';
import { useInstances } from '@/api/hooks/instances';
import { paginateResults } from '@/helpers';

export const useNodes = (
  projectId: string,
  clusterId: string,
  nodePoolId: string,
) =>
  useQuery({
    queryKey: [
      'project',
      projectId,
      'kubernetes',
      clusterId,
      'nodePools',
      nodePoolId,
      'nodes',
    ],
    queryFn: () => getNodes(projectId, clusterId, nodePoolId),
    throwOnError: true,
  });

export const usePaginatedNodes = (
  projectId: string,
  clusterId: string,
  nodePoolId: string,
  pagination: PaginationState,
  filters: Filter[],
) => {
  const {
    data: instances,
    error: InstancesError,
    isPending: isInstancesPending,
    isLoading: isInstancesLoading,
  } = useInstances(projectId);

  const { t } = useTranslation('detail');
  const {
    data: nodes,
    error: nodesError,
    isPending: isNodesPending,
    isLoading: isNodesLoading,
  } = useNodes(projectId, clusterId, nodePoolId);

  const {
    data: cluster,
    error: clusterError,
    isPending: isClusterPending,
    isLoading: isClusterLoading,
  } = useKubernetesCluster(projectId, clusterId);

  const {
    data: flavors,
    error: flavorsError,
    isPending: isFlavorsPending,
    isLoading: isFlavorsLoading,
  } = useRegionFlavors(projectId, cluster?.region);

  const nodesWithFlavorsAndBillingType = useMemo(
    () =>
      (nodes || []).map((node) => {
        const flavor = (flavors || []).find((f) => f.name === node.flavor);
        const instance = (instances || []).find(
          (i) => i.id === node.instanceId,
        );

        const billingType = (() => {
          if (!instance?.monthlyBilling) return 'hourly';
          if (instance?.monthlyBilling?.status === 'ok') return 'monthly';
          return 'monthly_pending';
        })();

        return {
          ...node,
          formattedFlavor: t('kube_flavor', {
            name: flavor?.name?.toUpperCase(),
            cpuNumber: flavor?.vcpus,
            ramCapacity: flavor?.ram / 1000,
            diskCapacity: flavor?.disk,
          }),
          billingType,
          canSwitchToMonthly:
            billingType === 'hourly' && !!flavor?.planCodes?.monthly,
        } as TNode;
      }),
    [nodes, flavors, instances],
  );

  return {
    data: useMemo(
      () =>
        paginateResults<TNode>(
          applyFilters(nodesWithFlavorsAndBillingType || [], filters),
          pagination,
        ),
      [nodesWithFlavorsAndBillingType, pagination, filters],
    ),
    error: nodesError || clusterError || flavorsError || InstancesError,
    isLoading:
      isNodesLoading ||
      isClusterLoading ||
      isFlavorsLoading ||
      isInstancesLoading,
    isPending:
      isNodesPending ||
      isClusterPending ||
      isFlavorsPending ||
      isInstancesPending,
  };
};

type RemoveNodeProps = {
  projectId: string;
  clusterId: string;
  nodeId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useDeleteNode = ({
  projectId,
  clusterId,
  nodeId,
  onError,
  onSuccess,
}: RemoveNodeProps) => {
  const mutation = useMutation({
    mutationFn: async () => deleteNode(projectId, clusterId, nodeId),
    onError: (cause: Error) => {
      onError(cause);
    },
    onSuccess: async () => {
      onSuccess();
    },
  });

  return {
    deleteNode: () => mutation.mutate(),
    ...mutation,
  };
};
