import { ReactNode } from 'react';
import { Table } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Filters } from './filters';
import { Filter, FilterList, FilterWithLabel } from './filter-list';

interface DataTableHeadProps<T> {
  actionButton?: ReactNode;
  searchBar?: {
    render: 'default' | ReactNode;
    table?: Table<T>;
    globalFilter: string;
  };
  filterButton?: {
    render: 'default' | ReactNode;
    columnFilters?: any;
    addFilter: (filter: FilterWithLabel) => void;
  };
  filterList?: {
    render: 'default' | ReactNode;
    filters: FilterWithLabel[];
    removeFilter: (filter: Filter) => void;
  };
}
export function DataTableHead<T>({
  actionButton,
  searchBar,
  filterButton,
  filterList,
}: DataTableHeadProps<T>) {
  return (
    <div>
      <div className="w-full flex justify-between flex-col sm:flex-row gap-2">
        {actionButton}
        <div className="flex w-full justify-end gap-2">
          {searchBar &&
            (searchBar.render === 'default' ? (
              <div className="flex">
                <Input
                  value={searchBar.globalFilter}
                  onChange={(e) =>
                    searchBar.table.setGlobalFilter(String(e.target.value))
                  }
                  placeholder="Search..."
                  className="max-w-72 rounded-r-none focus-visible:ring-transparent focus-visible:bg-primary-50"
                />
                <Button
                  className="rounded-l-none"
                  onClick={() =>
                    searchBar.table.setGlobalFilter(searchBar.globalFilter)
                  }
                >
                  <Search />
                </Button>
              </div>
            ) : (
              searchBar.render
            ))}
          {filterButton &&
            (filterButton.render === 'default' ? (
              <Filters
                columns={filterButton.columnFilters}
                onAddFilter={(addedFilter, column) => {
                  filterButton.addFilter({
                    ...addedFilter,
                    label: column.label,
                  });
                }}
              />
            ) : (
              filterButton.render
            ))}
        </div>
      </div>
      {filterList &&
        (filterList.render === 'default' ? (
          <FilterList
            filters={filterList.filters}
            onRemoveFilter={filterList.removeFilter}
          />
        ) : (
          filterList.render
        ))}
    </div>
  );
}
