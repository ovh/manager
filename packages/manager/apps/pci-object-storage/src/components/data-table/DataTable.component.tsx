import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { flexRender } from '@tanstack/react-table';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
} from '@datatr-ux/uxlib';
import { useDataTableContext } from './DataTable.context';

export const MENU_COLUMN_ID = 'actions_menu_column';

interface DatatableProps<TData> {
  renderRowExpansion?: (row: TData) => ReactElement | null;
}

export function DataTable<TData>({
  renderRowExpansion,
}: DatatableProps<TData>) {
  const { table, rows } = useDataTableContext<TData>();
  const { t } = useTranslation('pci-databases-analytics/components/data-table');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const headerGroups = table.getHeaderGroups();
  return (
    <Table>
      <TableHeader className="border bg-[#f7f8f8]">
        {headerGroups.map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {renderRowExpansion && (
              <TableHead className="border-r-0 w-6"></TableHead>
            )}
            {headerGroup.headers.map((header, index) => {
              const isEmptyHeader = header.id === MENU_COLUMN_ID;
              // Get a reference to the previous header
              const isEmptyNextHeader =
                headerGroup.headers[index + 1]?.id === MENU_COLUMN_ID;
              return (
                <TableHead
                  key={header.id}
                  className={`h-10 px-2 border font-semibold text-primary-800 ${
                    isEmptyHeader || renderRowExpansion
                      ? 'border-l-0' // Remove left border for empty headers and row extend column
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
            <React.Fragment key={row.id}>
              <TableRow data-state={row.getIsSelected() && 'selected'}>
                {renderRowExpansion && (
                  <TableCell>
                    <Button
                      mode="ghost"
                      onClick={() => toggleRowExpansion(row.id)}
                      data-testid="table-row-expand-button"
                    >
                      {expandedRows[row.id] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                )}
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-2 py-1">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
              {expandedRows[row.id] && renderRowExpansion && (
                <TableRow>
                  <TableCell colSpan={headerGroups[0].headers.length + 1}>
                    {renderRowExpansion(row.original)}
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
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
