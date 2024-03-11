import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import { Plus } from 'lucide-react';
import { H2, P } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';

import { useModale } from '@/hooks/useModale';
import { useGetConnectionPools } from '@/hooks/api/connectionPool.api.hooks';
import { useGetDatabases } from '@/hooks/api/databases.api.hook';
import { useGetUsers } from '@/hooks/api/users.api.hooks';

import { useServiceData } from '../layout';
import { POLLING } from '@/configuration/polling';
import { getColumns } from './_components/poolsTableColumns';
import InfoConnectionPoolModal from './_components/infoConnectionPool';
import DeleteConnectionPool from './_components/deleteConnectionPool';
import ConnectionPoolModal from './_components/connectionPool';
import { ConnectionPoolWithData } from '@/api/databases/connectionPool';

export function breadcrumb() {
  return 'Pools';
}

const Pools = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/pools',
  );
  const { projectId, service } = useServiceData();
  const [connectionPoolListWithData, setConnectionPoolListWithData] = useState<
    ConnectionPoolWithData[]
  >([]);
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

  useEffect(() => {
    if (
      !(
        connectionPoolsQuery.isSuccess &&
        usersQuery.isSuccess &&
        databasesQuery.isSuccess
      )
    )
      return;
    const cpListWithData: ConnectionPoolWithData[] = connectionPoolsQuery.data.map(
      (cp) => ({
        ...cp,
        userName: cp.userId
          ? usersQuery.data.find((user) => user.id === cp.userId).username
          : '',
        databaseName: databasesQuery.data.find((db) => db.id === cp.databaseId)
          .name,
      }),
    );
    setConnectionPoolListWithData(cpListWithData);
  }, [connectionPoolsQuery.data, usersQuery.data, databasesQuery.data]);

  const columns: ColumnDef<ConnectionPoolWithData>[] = getColumns({
    onGetInformationClick: (pools: ConnectionPoolWithData) =>
      getInfoModale.open(pools.id),
    onEditClick: (pools: ConnectionPoolWithData) => editModale.open(pools.id),
    onDeleteClick: (pools: ConnectionPoolWithData) =>
      deleteModale.open(pools.id),
  });

  const connectionPoolToDelete = connectionPoolListWithData?.find(
    (cp) => cp.id === deleteModale.value,
  );

  const connectionPoolToDisplayInfo = connectionPoolListWithData?.find(
    (cp) => cp.id === getInfoModale.value,
  );

  const connectionPoolToEdit = connectionPoolListWithData?.find(
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

      {connectionPoolListWithData ? (
        <DataTable
          columns={columns}
          data={connectionPoolListWithData}
          pageSize={25}
        />
      ) : (
        <DataTable.Skeleton columns={5} rows={2} width={100} height={16} />
      )}
      {connectionPoolsQuery.isSuccess &&
        usersQuery.isSuccess &&
        databasesQuery.isSuccess && (
          <ConnectionPoolModal
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

      {connectionPoolToDisplayInfo &&
        connectionPoolsQuery.isSuccess &&
        databasesQuery.isSuccess && (
          <InfoConnectionPoolModal
            service={service}
            controller={getInfoModale.controller}
            connectionPool={connectionPoolToDisplayInfo}
            databases={databasesQuery.data}
          />
        )}

      {connectionPoolToEdit &&
        connectionPoolsQuery.isSuccess &&
        usersQuery.isSuccess &&
        databasesQuery.isSuccess && (
          <ConnectionPoolModal
            isEdition={true}
            controller={editModale.controller}
            connectionPools={connectionPoolsQuery.data}
            editedConnectionPool={connectionPoolToEdit}
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

      {connectionPoolToDelete && (
        <DeleteConnectionPool
          controller={deleteModale.controller}
          service={service}
          connectionPool={connectionPoolToDelete}
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
