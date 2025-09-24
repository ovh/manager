import { ReactNode } from 'react';
import { useDataTableContext } from './DataTable.context';
import DataTableDefaultFilterButton from './DatatableDefaultFilterButton.component';

export function DatatableFiltersButton({ children }: { children?: ReactNode }) {
  const { filtersDefinition, columnFilters } = useDataTableContext();
  if (!filtersDefinition?.length) return <></>;
  return (
    <>
      {children || (
        <DataTableDefaultFilterButton
          columns={filtersDefinition}
          onAddFilter={(addedFilter, column) => {
            columnFilters.addFilter({
              ...addedFilter,
              label: column.label,
            });
          }}
        />
      )}
    </>
  );
}
