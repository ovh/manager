import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { PaginationState } from '@ovhcloud/manager-components';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { paginateResults } from '@/helpers';
import { getAllKube, TKube } from '../data/kubernetes';
import { getPrivateNetworkName } from '../data/network';
import { useAllPrivateNetworks } from './useNetwork';

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
