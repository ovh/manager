import { useMemo } from 'react';
import { FilterCategories } from '@ovh-ux/manager-core-api';
import { ColumnFilter } from '../../filters/filter-add.component';

export const useDatagridTopbar = ({
  columns,
  visibleColumns,
}: {
  columns: any;
  visibleColumns: any;
}) => {
  const hasSearchFeature = useMemo(
    () => columns?.some((col) => col?.isSearchable),
    [columns],
  );
  const hasVisibilityFeature = useMemo(
    () => visibleColumns?.some((col) => col.columnDef?.enableHiding),
    [visibleColumns],
  );
  const filtersColumns = useMemo<ColumnFilter[]>(
    () =>
      columns
        ?.filter(
          (item) =>
            ('comparator' in item || 'type' in item) &&
            'isFilterable' in item &&
            item.isFilterable,
        )
        .map((column) => ({
          id: column.id,
          label: column.label,
          ...(column?.type && {
            comparators: FilterCategories[column.type],
            type: column.type,
          }),
          ...(column?.comparator && { comparators: column.comparator }),
          ...(column?.filterOptions && { options: column.filterOptions }),
        })),
    [columns],
  );
  return {
    filtersColumns,
    hasSearchFeature,
    hasVisibilityFeature,
  };
};
