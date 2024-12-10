import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { flexRender } from '@tanstack/react-table';
import { useDataTableContext } from './DataTableContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const MENU_COLUMN_ID = 'actions';

export function DataTable() {
  const { table, globalFilter, columnFilters } = useDataTableContext();
  const { t } = useTranslation('pci-databases-analytics/components/data-table');

  const rows = useMemo(() => table.getRowModel()?.rows, [
    table,
    globalFilter,
    columnFilters.filters,
  ]);
  const headerGroups = table.getHeaderGroups();
  return (
    <Table>
      <TableHeader className="border bg-gray-50">
        {headerGroups.map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header, index) => {
              const isEmptyHeader = header.id === MENU_COLUMN_ID;
              // Get a reference to the previous header
              const isEmptyNextHeader =
                headerGroup.headers[index + 1]?.id === MENU_COLUMN_ID;
              return (
                <TableHead
                  key={header.id}
                  className={`border font-semibold text-primary-800 ${
                    isEmptyHeader
                      ? 'border-l-0' // Remove left border for empty headers
                      : ''
                  } ${
                    isEmptyNextHeader
                      ? 'border-r-0' // Remove right border from current column if next header is empty
                      : ''
                  }`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody className="border">
        {rows?.length ? (
          rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={headerGroups[0].headers.length}
              className="h-24 text-center"
            >
              {t('noResult')}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
