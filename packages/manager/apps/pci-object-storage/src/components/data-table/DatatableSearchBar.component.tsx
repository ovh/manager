import { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { Button, Input } from '@datatr-ux/uxlib';
import { useDataTableContext } from './DataTable.context';

export function DatatableSearchBar({ children }: { children?: ReactNode }) {
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
}
