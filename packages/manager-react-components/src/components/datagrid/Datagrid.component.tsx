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
  containerHeight,
}: DatagridProps<T>) => {
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
  const containerHeightAuto = useContainerHeight({ tableContainerRef });

  console.info('Datagrid containerHeight', containerHeight);
  return (
    <>
      <div
        ref={tableContainerRef}
        style={{
          overflow: 'auto',
          position: 'relative',
          height:
            containerHeight ||
            (rows?.length > 5 ? containerHeightAuto : '100%'),
        }}
      >
        <Table className="w-full" style={{ display: 'grid' }}>
          <TableHeaderContent<T>
            headerGroups={headerGroups}
            onSortChange={onSortChange}
            sorting={sorting}
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
