import { useQuery } from '@tanstack/react-query';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { useMemo } from 'react';
import uniqBy from 'lodash.uniqby';
import {
  GatewayOptions,
  getAllAggregatedGateway,
  paginateResults,
} from '@/api/data/gateway';
import { Gateway } from '@/interface';

export const useAllAggregatedGateway = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'gateway'],
    queryFn: () => getAllAggregatedGateway(projectId),
    retry: false,
    select: (data): Gateway[] =>
      data.resources.map((row) => ({
        ...row,
        model: row.model.toUpperCase(),
        connectedNetworkCount: uniqBy(row.interfaces, 'subnetId').length,
        formattedIps:
          row.externalInformation.ips.map((ip) => ip.ip).join(', ') || '',
      })),
  });

export const useAggregatedGateway = (
  projectId: string,
  { pagination }: GatewayOptions,
  filters: Filter[] = [],
) => {
  const { data: gateways, error, isLoading } = useAllAggregatedGateway(
    projectId,
  );

  return useMemo(() => {
    return {
      isLoading,
      error,
      data: paginateResults(applyFilters(gateways || [], filters), pagination),
    };
  }, [isLoading, error, gateways, pagination, filters]);
};
