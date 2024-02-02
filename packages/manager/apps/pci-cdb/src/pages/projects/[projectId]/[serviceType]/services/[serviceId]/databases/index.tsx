import { ColumnDef } from '@tanstack/react-table';
import { H2 } from '@/components/typography';
import { useServiceData } from '../serviceData.hook';
import { useGetDatabases } from '@/hooks/api/databases.api.hooks';
import { DataTable } from '@/components/ui/data-table';
import { database } from '@/models/database';
import { getColumns } from './_components/databasesTableColumns';

export const Handle = {
  breadcrumb: () => 'Databases',
};

const DatabasesPage = () => {
  const { projectId, service } = useServiceData();
  const databasesQuery = useGetDatabases(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: 30_000,
    },
  );
  const columns: ColumnDef<database.service.Database>[] = getColumns();
  return (
    <>
      <H2>Databases</H2>
      {databasesQuery.isSuccess ? (
        <>
          <DataTable
            columns={columns}
            data={databasesQuery.data}
            pageSize={25}
          />
        </>
      ) : (
        <DataTable.Skeleton columns={3} rows={5} width={100} height={16} />
      )}
    </>
  );
};

export default DatabasesPage;
