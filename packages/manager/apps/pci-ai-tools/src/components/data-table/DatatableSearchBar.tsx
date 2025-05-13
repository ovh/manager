import { ReactNode } from 'react';
import { Button, Input } from '@datatr-ux/uxlib';
import { Search } from 'lucide-react';
import { useDataTableContext } from './DataTableContext';

const DatatableSearchBar = ({ children }: { children?: ReactNode }) => {
  const { table, globalFilter } = useDataTableContext();
  return (
    <>
      {children || (
        <div className="flex justify-end w-full">
          <Input
            value={globalFilter}
            onChange={(e) => table.setGlobalFilter(String(e.target.value))}
            placeholder="Search..."
            className="max-w-full sm:max-w-72 rounded-r-none focus-visible:ring-transparent focus-visible:bg-primary-50"
          />
          <Button
            className="rounded-l-none"
            onClick={() => table.setGlobalFilter(globalFilter)}
          >
            <Search />
          </Button>
        </div>
      )}
    </>
  );
};

export default DatatableSearchBar;
