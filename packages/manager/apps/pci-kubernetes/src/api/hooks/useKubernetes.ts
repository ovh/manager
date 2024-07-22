import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { PaginationState } from '@ovhcloud/manager-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { paginateResults } from '@/helpers';
import {
  getAllKube,
  getKubernetesCluster,
  updateKubernetesCluster,
} from '../data/kubernetes';
import { getPrivateNetworkName } from '../data/network';
import { useAllPrivateNetworks } from './useNetwork';
import { TKube } from '@/types';
import queryClient from '@/queryClient';

export const getAllKubeQueryKey = (projectId: string) => [
  'project',
  projectId,
  'kube',
];

export const useAllKube = (projectId: string) =>
  useQuery({
    queryKey: getAllKubeQueryKey(projectId),
    queryFn: (): Promise<Required<TKube[]>> => getAllKube(projectId),
  });

export const useKubes = (
  projectId: string,
  { pagination }: { pagination: PaginationState },
  filters: Filter[],
) => {
  const { t } = useTranslation('listing');

  const {
    data: allKube,
    error: allKubeError,
    isLoading: isAllKubeLoading,
    isPending: isAllKubePending,
  } = useAllKube(projectId);

  const {
    data: privateNetworks,
    error: networksError,
    isLoading: isNetworksLoading,
    isPending: isNetworksPending,
  } = useAllPrivateNetworks(projectId);

  return useMemo(() => {
    const result = allKube?.map((kube) => ({
      ...kube,
      attachedTo: kube.privateNetworkId
        ? getPrivateNetworkName(privateNetworks, kube.privateNetworkId)
        : t('kube_list_network_public'),
    }));

    return {
      isLoading: isAllKubeLoading || isNetworksLoading,
      isPending: isAllKubePending || isNetworksPending,
      data: paginateResults<TKube>(
        applyFilters(result || [], filters),
        pagination,
      ),
      error: allKubeError || networksError,
    };
  }, [
    allKube,
    allKubeError,
    isAllKubeLoading,
    isAllKubePending,
    privateNetworks,
    networksError,
    isNetworksLoading,
    isNetworksPending,
    pagination,
    filters,
  ]);
};
export const useKubernetesCluster = (projectId: string, kubeId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'kube', kubeId],
    queryFn: () => getKubernetesCluster(projectId, kubeId),
  });
type RenameKubernetesClusterProps = {
  projectId: string;
  kubeId: string;
  name: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

function getKubernetesClusterQuery(projectId: string, kubeId: string) {
  return ['project', projectId, 'kube', kubeId];
}

export const useRenameKubernetesCluster = ({
  projectId,
  kubeId,
  name,
  onError,
  onSuccess,
}: RenameKubernetesClusterProps) => {
  const mutation = useMutation({
    mutationFn: async () =>
      updateKubernetesCluster(projectId, kubeId, { name }),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getKubernetesClusterQuery(projectId, kubeId),
      });
      onSuccess();
    },
  });
  return {
    renameCluster: () => mutation.mutate(),
    ...mutation,
  };
};
