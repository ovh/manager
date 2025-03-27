import { ReactNode } from 'react';
import { useDataTableContext } from './DataTableContext';
import DataTableDefaultFilterButton from './DatatableDefaultFilterButton';

const DatatableFiltersButton = ({ children }: { children?: ReactNode }) => {
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
};

export default DatatableFiltersButton;
