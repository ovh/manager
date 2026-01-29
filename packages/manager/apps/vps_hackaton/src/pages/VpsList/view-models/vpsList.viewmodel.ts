import type { TVpsList, TVps, TVpsState } from '@/domain/entities/vps';
import { filterVpsByName, sortVpsBy } from '@/domain/services/vpsFilter.service';
import { filterVpsByState } from '@/domain/services/vpsState.service';
import { formatDate } from '@/domain/services/vpsTransform.service';
import type { TSortDirection, TSortableField } from '@/domain/services/vpsFilter.service';

export type TVpsListFilters = {
  searchTerm: string;
  state?: TVpsState;
  sortField: TSortableField;
  sortDirection: TSortDirection;
  page: number;
  pageSize: number;
};

export type TPaginatedVpsListResult = {
  items: Array<TVpsForView>;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

export type TVpsForView = {
  serviceName: string;
  displayName: string;
  state: TVpsState;
  datacenter: string;
  model: string;
  ipAddress: string;
  expirationDate: string | null;
  formattedExpiration: string;
};

const mapVpsToView = (vps: TVps): TVpsForView => ({
  serviceName: vps.serviceName,
  displayName: vps.displayName,
  state: vps.state,
  datacenter: vps.location.datacenter,
  model: vps.model.name,
  ipAddress: vps.network.ipV4 || '-',
  expirationDate: vps.subscription.expirationDate,
  formattedExpiration: vps.subscription.expirationDate
    ? formatDate(vps.subscription.expirationDate)
    : '-',
});

export const selectVpsListForView =
  (filters: TVpsListFilters) =>
  (data?: TVpsList): TPaginatedVpsListResult => {
    if (!data) {
      return {
        items: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: filters.pageSize,
      };
    }

    let filtered = data;

    // Apply search filter
    if (filters.searchTerm) {
      filtered = filterVpsByName(filters.searchTerm)(filtered);
    }

    // Apply state filter
    if (filters.state) {
      filtered = filterVpsByState(filters.state)(filtered);
    }

    // Apply sorting
    filtered = sortVpsBy(filters.sortField, filters.sortDirection)(filtered);

    // Calculate pagination
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / filters.pageSize);
    const startIndex = (filters.page - 1) * filters.pageSize;
    const endIndex = startIndex + filters.pageSize;

    // Apply pagination and map to view model
    const paginatedItems = filtered.slice(startIndex, endIndex).map(mapVpsToView);

    return {
      items: paginatedItems,
      totalItems,
      totalPages,
      currentPage: filters.page,
      pageSize: filters.pageSize,
    };
  };

export const DEFAULT_FILTERS: TVpsListFilters = {
  searchTerm: '',
  sortField: 'displayName',
  sortDirection: 'asc',
  page: 1,
  pageSize: 10,
};
