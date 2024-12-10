import { ReactNode } from 'react';
import { useDataTableContext } from './DataTableContext';
import { Filters } from './filters';

const DatatableFiltersButton = ({ children }: { children?: ReactNode }) => {
  const { filtersDefinition, columnFilters } = useDataTableContext();
  if (!filtersDefinition?.length) return <></>;
  return (
    <>
      {children || (
        <Filters
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
