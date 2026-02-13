import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Button, Input } from '@datatr-ux/uxlib';
import { useDataTableContext } from './DataTable.context';

const DatatableSearchBar = ({ children }: { children?: ReactNode }) => {
  const { t } = useTranslation('components/data-table');
  const { table, globalFilter } = useDataTableContext();
  return (
    <>
      {children || (
        <div className="flex justify-end w-full">
          <Input
            value={globalFilter}
            onChange={(e) => table.setGlobalFilter(String(e.target.value))}
            placeholder={t('searchPlaceholder')}
            className="max-w-full sm:max-w-72 rounded-r-none focus-visible:ring-transparent focus-visible:bg-primary-50 h-10"
          />
          <Button
            className="rounded-l-none h-10"
            onClick={() => table.setGlobalFilter(globalFilter)}
          >
            <Search />
          </Button>
        </div>
      )}
    </>
  );
};

export { DatatableSearchBar };
