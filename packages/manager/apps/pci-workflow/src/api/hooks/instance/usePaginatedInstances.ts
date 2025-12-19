import { useMemo } from 'react';

import { Filter, applyFilters } from '@ovh-ux/manager-core-api';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';

import { sortResults } from '@/api/hooks/instance/selector/instances.selector';
import { useAllInstances } from '@/api/hooks/instance/useAllInstances';
import { paginateResults } from '@/helpers';

export const usePaginatedInstances = (
  projectId: string,
  { pagination, sorting }: { pagination: PaginationState; sorting?: ColumnSort },
  filters: Filter[] = [],
) => {
  const { instances, isPending } = useAllInstances(projectId);
  return {
    isPending,

    data: useMemo(
      () =>
        paginateResults(sortResults(applyFilters(instances || [], filters), sorting), pagination),
      [instances, pagination, sorting, filters],
    ),
  };
};
