import {
  ChevronLeft,
  ChevronRight,
  ChevronFirst,
  ChevronLast,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@datatr-ux/uxlib';
import { useDataTableContext } from './DataTable.context';

export function DataTablePagination() {
  const { t } = useTranslation('components/data-table');
  const { table } = useDataTableContext();
  const itemCount = table.getRowCount();
  if (itemCount === 0) return <></>;
  return (
    <div className="flex justify-end mt-4">
      <div className="flex items-center">
        <div className="flex items-center space-x-2">
          {itemCount > 0 && (
            <div className="flex px-4 items-center justify-center text-sm font-medium">
              <span>{t('itemCount', { count: itemCount })}</span>
            </div>
          )}
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 25, 50, 100, 300].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex px-4 items-center justify-center text-sm font-medium">
          <span>
            {t('currentPage', {
              currentPage: table.getState().pagination.pageIndex + 1,
              totalPagesCount: table.getPageCount(),
            })}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            mode="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t('goToFirstPage')}</span>
            <ChevronFirst className="h-4 w-4" />
          </Button>
          <Button
            mode="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t('goToPreviousPage')}</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            mode="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t('goToNextPage')}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            mode="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t('goToLastPage')}</span>
            <ChevronLast className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
