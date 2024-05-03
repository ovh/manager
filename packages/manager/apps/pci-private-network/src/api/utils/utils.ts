import { PaginationState } from '@ovhcloud/manager-components';
import { TRegion } from '@/api/data/project';

export const getLocalZoneRegions = (customerRegions: TRegion[] = []) =>
  customerRegions?.filter(({ type }) => type.includes('localzone')) || [];

export const isLocalZoneRegion = (regions: TRegion[], regionName: string) =>
  regions.some((region) => region.name === regionName);

export const paginateResults = <T>(
  items: T[],
  pagination: PaginationState,
) => ({
  rows: items.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize,
  ),
  pageCount: Math.ceil(items.length / pagination.pageSize),
  totalRows: items.length,
});
