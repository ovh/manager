import { v6 } from '@ovh-ux/manager-core-api';
import { PaginationState } from '@ovhcloud/manager-components';
import { Gateway, GatewayResponse } from '@/interface';

export type GatewayOptions = {
  pagination: PaginationState;
};

export const getAllAggregatedGateway = async (
  projectId: string,
): Promise<GatewayResponse> => {
  const { data } = await v6.get<GatewayResponse>(
    `/cloud/project/${projectId}/aggregated/gateway`,
  );
  return data;
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
