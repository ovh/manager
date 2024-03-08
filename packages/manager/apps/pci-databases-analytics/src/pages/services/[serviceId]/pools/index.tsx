import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';

import { Plus } from 'lucide-react';
import { H2, P } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';

import { useModale } from '@/hooks/useModale';
import { useGetConnectionPools } from '@/hooks/api/connectionPool.api.hooks';
import { useGetDatabases } from '@/hooks/api/databases.api.hook';
import { useGetUsers } from '@/hooks/api/users.api.hooks';

import { useServiceData } from '../layout';
import { database } from '@/models/database';
import { POLLING } from '@/configuration/polling';
import { getColumns } from './_components/poolsTableColumns';
import InfoConnectionPoolModal from './_components/infoConnectionPool';
import AddEditConnectionPoolModal from './_components/addEditConnectionPool';
import DeleteConnectionPool from './_components/deleteConnectionPool';

export function breadcrumb() {
  return 'Pools';
}

const Pools = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/pools',
  );
  const { projectId, service } = useServiceData();
  const addModale = useModale('add');
  const getInfoModale = useModale('information');
  const deleteModale = useModale('delete');
  const editModale = useModale('edit');
  const connectionPoolsQuery = useGetConnectionPools(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: POLLING.POOLS,
    },
  );
  const databasesQuery = useGetDatabases(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: POLLING.DATABASES,
    },
  );
  const usersQuery = useGetUsers(projectId, service.engine, service.id, {
    refetchInterval: POLLING.USERS,
  });

  const columns: ColumnDef<database.postgresql.ConnectionPool>[] = getColumns({
    databases: databasesQuery.data,
    users: usersQuery.data,
    onGetInformationClick: (pools: database.postgresql.ConnectionPool) =>
      getInfoModale.open(pools.id),
    onEditClick: (pools: database.postgresql.ConnectionPool) =>
      editModale.open(pools.id),
    onDeleteClick: (pools: database.postgresql.ConnectionPool) =>
      deleteModale.open(pools.id),
  });

  const conenctionPoolToDelete = connectionPoolsQuery.data?.find(
    (cp) => cp.id === deleteModale.value,
  );

  const conenctionPoolToDisplayInfo = connectionPoolsQuery.data?.find(
    (cp) => cp.id === getInfoModale.value,
  );

  const conenctionPoolToEdit = connectionPoolsQuery.data?.find(
    (cp) => cp.id === editModale.value,
  );

  return (
    <>
      <H2 className="mb-2">{t('title')}</H2>
      <P className="mb-2">{t('description')}</P>
      <Button
        variant={'outline'}
        size="sm"
        className="text-base mb-2"
        onClick={() => addModale.open()}
      >
        <Plus className="size-4 mr-2" />
        {t('addButtonLabel')}
      </Button>

      {connectionPoolsQuery.isSuccess &&
      usersQuery.isSuccess &&
      databasesQuery.isSuccess ? (
        <DataTable
          columns={columns}
          data={connectionPoolsQuery.data}
          pageSize={25}
        />
      ) : (
        <DataTable.Skeleton columns={5} rows={2} width={100} height={16} />
      )}

      {connectionPoolsQuery.isSuccess &&
        usersQuery.isSuccess &&
        databasesQuery.isSuccess && (
          <AddEditConnectionPoolModal
            isEdition={false}
            controller={addModale.controller}
            users={usersQuery.data}
            service={service}
            connectionPools={connectionPoolsQuery.data}
            databases={databasesQuery.data}
            onSuccess={() => {
              addModale.close();
              databasesQuery.refetch();
              connectionPoolsQuery.refetch();
            }}
          />
        )}

      {conenctionPoolToDisplayInfo &&
        connectionPoolsQuery.isSuccess &&
        databasesQuery.isSuccess && (
          <InfoConnectionPoolModal
            service={service}
            controller={getInfoModale.controller}
            connectionPool={conenctionPoolToDisplayInfo}
            databases={databasesQuery.data}
          />
        )}

      {conenctionPoolToEdit &&
        connectionPoolsQuery.isSuccess &&
        usersQuery.isSuccess &&
        databasesQuery.isSuccess && (
          <AddEditConnectionPoolModal
            isEdition={true}
            controller={editModale.controller}
            editedConnectionPool={conenctionPoolToEdit}
            users={usersQuery.data}
            service={service}
            databases={databasesQuery.data}
            onSuccess={() => {
              editModale.close();
              databasesQuery.refetch();
              connectionPoolsQuery.refetch();
            }}
          />
        )}

      {conenctionPoolToDelete && (
        <DeleteConnectionPool
          controller={deleteModale.controller}
          service={service}
          connectionPool={conenctionPoolToDelete}
          onSuccess={() => {
            deleteModale.close();
            connectionPoolsQuery.refetch();
            usersQuery.refetch();
            databasesQuery.refetch();
          }}
        />
      )}
    </>
  );
};

export default Pools;
