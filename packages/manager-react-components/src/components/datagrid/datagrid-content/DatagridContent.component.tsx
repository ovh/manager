import { Table } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { TableHeaderContent } from '../table/table-head';
import { TableBody } from '../table/table-body/TableBody.component';
import { useDatagridTable } from '../useDatagridTable';
import { useDatagridContext } from '../useDatagrid.context';
import { Text } from '../../text';

export const DatagridContent = <T,>() => {
  const { t } = useTranslation('datagrid');
  const {
    isContextError,
    columns,
    data,
    sorting,
    onSortChange,
    manualSorting,
  } = useDatagridContext<T>();
  const table = useDatagridTable({
    columns: columns,
    data: data,
    sorting,
    onSortChange,
    manualSorting,
  });

  if (isContextError) {
    return <Text>{t('manager_datagrid_error_context_not_found')}</Text>;
  }

  return (
    <Table>
      <TableHeaderContent headerGroups={table.getHeaderGroups()} />
      <TableBody rowModel={table.getRowModel()} />
    </Table>
  );
};
