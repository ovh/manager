import { useRef } from 'react';
import { Table } from '@ovhcloud/ods-react';
import { TableBody } from './table/table-body/TableBody.component';
import { TableHeaderContent } from './table/table-head/table-header-content/TableHeaderContent.component';
import { FooterActions } from './table/table-footer/footer-actions/FooterActions.component';
import { useContainerHeight } from './useContainerHeight';
import { useDatagrid } from './useDatagrid';
import { DatagridProps } from './Datagrid.props';
import './translations';

export const Datagrid = <T extends Record<string, unknown>>({
  columns,
  data,
  onSortChange,
  sorting,
  manualSorting = false,
  contentAlignLeft = true,
  hasNextPage,
  onFetchAllPages,
  onFetchNextPage,
  isLoading,
}: DatagridProps<T>) => {
  const headerRefs = useRef<Record<string, HTMLTableCellElement>>({});
  const { getHeaderGroups, getRowModel } = useDatagrid({
    columns,
    data,
    sorting,
    onSortChange,
    manualSorting,
  });

  const rowModel = getRowModel();
  const { rows } = rowModel;
  const headerGroups = getHeaderGroups();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const containerHeight = useContainerHeight({ tableContainerRef });

  return (
    <>
      <div
        ref={tableContainerRef}
        style={{
          overflow: 'auto', //our scrollable table container
          position: 'relative', //needed for sticky header
          height: rows?.length > 6 ? containerHeight : '100%',
        }}
      >
        {/* Even though we're still using semantic table tags, we must use CSS grid and flexbox for dynamic row heights */}
        <Table className="w-full" style={{ display: 'grid' }}>
          <TableHeaderContent<T>
            headerGroups={headerGroups}
            onSortChange={onSortChange}
            sorting={sorting}
            headerRefs={headerRefs.current}
            contentAlignLeft={contentAlignLeft}
          />
          <TableBody
            rowModel={rowModel}
            tableContainerRef={tableContainerRef}
          />
        </Table>
      </div>
      <FooterActions
        hasNextPage={hasNextPage}
        onFetchAllPages={onFetchAllPages}
        onFetchNextPage={onFetchNextPage}
        isLoading={isLoading}
      />
    </>
  );
};
