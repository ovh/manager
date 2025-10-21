import { useMemo } from 'react';

import { FilterCategories } from '@ovh-ux/manager-core-api';

import { ColumnFilter } from '../../filters';
import { UseDatagridTopbarProps } from './useDatagridTopbar.props';

export const useDatagridTopbar = <T,>({ columns, visibleColumns }: UseDatagridTopbarProps<T>) => {
  const hasVisibilityFeature = useMemo(
    () => visibleColumns?.some((col) => col.columnDef?.enableHiding),
    [visibleColumns],
  );
  const filtersColumns = useMemo<ColumnFilter[]>(
    () =>
      columns
        ?.filter(
          (item) =>
            ('comparator' in item || 'type' in item) && 'isFilterable' in item && item.isFilterable,
        )
        .map((column) => ({
          id: column.id || '',
          label: column.label || '',
          comparators:
            column?.comparator ||
            FilterCategories[column?.type as keyof typeof FilterCategories] ||
            [],
          ...(column?.type && { type: column.type }),
          ...(column?.filterOptions && { options: column.filterOptions }),
        })) || [],
    [columns],
  );
  return {
    filtersColumns,
    hasVisibilityFeature,
  };
};
