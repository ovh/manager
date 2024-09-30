import { v6 } from '@ovh-ux/manager-core-api';
import { PaginationState } from '@ovh-ux/manager-react-components';
import { Gateway, GatewayResponse } from '@/interface';

export type GatewayOptions = {
  pagination: PaginationState;
};

export const getAllAggregatedGateway = async (
  projectId: string,
): Promise<Gateway[]> => {
  const { data } = await v6.get<GatewayResponse>(
    `/cloud/project/${projectId}/aggregated/gateway`,
  );
  return data.resources;
};

export const paginateResults = (
  items: unknown[],
  pagination: PaginationState,
) => ({
  rows: items.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize,
  ),
  pageCount: Math.ceil(items.length / pagination.pageSize),
  totalRows: items.length,
});

export const deleteGateway = async (
  projectId: string,
  regionName: string,
  gatewayId: string,
) => {
  const { data } = await v6.delete(
    `/cloud/project/${projectId}/region/${regionName}/gateway/${gatewayId}`,
  );
  return data;
};
