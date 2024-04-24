import { PaginationState } from '@ovhcloud/manager-components';
import { TRegion } from '@/api/data/project';
import { TAggregatedNetwork } from '../data/network';

export const getLocalZoneRegions = (customerRegions: TRegion[] = []) => {
  return (
    customerRegions?.filter(({ type }) => type.includes('localzone')) || []
  );
};

export const isLocalZoneRegion = (regions: TRegion[], regionName: string) => {
  return regions.some((region) => region.name === regionName);
};

export const paginateResults = (
  items: TAggregatedNetwork[],
  pagination: PaginationState,
) => {
  return {
    rows: items.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize,
    ),
    pageCount: Math.ceil(items.length / pagination.pageSize),
    totalRows: items.length,
  };
};
