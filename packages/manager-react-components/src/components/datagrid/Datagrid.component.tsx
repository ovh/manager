import { DatagridProps } from './Datagrid.props';
import { DatagridProvider } from './useDatagrid.context';
import { DatagridContent } from './datagrid-content/DatagridContent.component';
import './translations';

export const Datagrid = <T,>({ columns, data }: DatagridProps<T>) => {
  return (
    <DatagridProvider initialColumns={columns} initialData={data}>
      <DatagridContent />
    </DatagridProvider>
  );
};
