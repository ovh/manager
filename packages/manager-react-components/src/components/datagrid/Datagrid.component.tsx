import { DatagridProps } from './Datagrid.props';
import { DatagridProvider } from './useDatagrid.context';
import { DatagridContent } from './datagrid-content/DatagridContent.component';
import './translations';

export const Datagrid = <T,>({
  columns,
  data,
  onSortChange,
  sorting,
  manualSorting = false,
}: DatagridProps<T>) => {
  return (
    <DatagridProvider
      columns={columns}
      data={data}
      onSortChange={onSortChange}
      sorting={sorting}
      manualSorting={manualSorting}
    >
      <DatagridContent />
    </DatagridProvider>
  );
};
