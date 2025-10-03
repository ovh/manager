import { useMemo } from 'react';
import { FilterCategories } from '@ovh-ux/manager-core-api';
import { Column } from '@tanstack/react-table';
import { ColumnFilter } from '../../filters/filter-add.component';
import { ManagerColumnDef } from '../Datagrid.props';

export const useDatagridTopbar = ({
  columns,
  visibleColumns,
}: {
  columns?: ManagerColumnDef<any>[];
  visibleColumns?: Column<any, unknown>[];
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
    hasSearchFeature,
    hasVisibilityFeature,
  };
};
