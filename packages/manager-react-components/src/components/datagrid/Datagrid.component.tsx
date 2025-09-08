import { useRef } from 'react';
import { Table } from '@ovhcloud/ods-react';
import { TableBody } from './table/table-body/TableBody.component';
import { TableHeaderContent } from './table/table-head/table-header-content/TableHeaderContent.component';
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
  const headerGroups = getHeaderGroups();

  return (
    <Table>
      <TableHeaderContent<T>
        headerGroups={headerGroups}
        onSortChange={onSortChange}
        sorting={sorting}
        headerRefs={headerRefs.current}
        contentAlignLeft={contentAlignLeft}
      />
      <TableBody rowModel={rowModel} />
    </Table>
  );
};
