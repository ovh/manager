import { useMutation, useQuery } from '@tanstack/react-query';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { useMemo } from 'react';
import uniqBy from 'lodash.uniqby';
import queryClient from '@/queryClient';
import {
  deleteGateway,
  GatewayOptions,
  getAllAggregatedGateway,
  paginateResults,
} from '@/api/data/gateway';
import { Gateway, GatewayResponse } from '@/interface';

export const useAllAggregatedGateway = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'gateway'],
    queryFn: () => getAllAggregatedGateway(projectId),
    retry: false,
    select: (data): Gateway[] => [
      ...data.resources.map((row) => ({
        ...row,
        model: row.model.toUpperCase(),
        connectedNetworkCount: uniqBy(row.interfaces, 'subnetId').length,
        formattedIps:
          row.externalInformation.ips.map((ip) => ip.ip).join(', ') || '',
      })),
    ],
  });

export const useAggregatedGateway = (
  projectId: string,
  { pagination }: GatewayOptions,
  filters: Filter[] = [],
) => {
  const {
    data: gateways,
    error,
    isLoading,
    isPending,
  } = useAllAggregatedGateway(projectId);

  return useMemo(
    () => ({
      isLoading,
      isPending,
      error,
      data: paginateResults(applyFilters(gateways || [], filters), pagination),
    }),
    [isLoading, error, gateways, pagination, filters],
  );
};

type RemoveGatewayProps = {
  projectId: string;
  gatewayId: string;
  region: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useDeleteGateway = ({
  projectId,
  gatewayId,
  region,
  onError,
  onSuccess,
}: RemoveGatewayProps) => {
  const mutation = useMutation({
    mutationFn: async () => deleteGateway(projectId, region, gatewayId),
    onError,
    onSuccess: async () => {
      queryClient.setQueryData(
        ['project', projectId, 'gateway'],
        (old: GatewayResponse) => ({
          ...old,
          resources: old.resources.filter(({ id }) => id !== gatewayId),
        }),
      );
      onSuccess();
    },
  });

  return {
    deleteGateway: () => mutation.mutate(),
    ...mutation,
  };
};
