import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';

import { useModale } from '@/hooks/useModale';

import { useServiceData } from '../Service.context';
import { POLLING } from '@/configuration/polling.constants';
import { GenericUser } from '@/data/api/database/user.api';
import * as database from '@/types/cloud/project/database';
import { getColumns } from './_components/PoolsTableColumns.component';
import InfoConnectionPool from './_components/InfoConnectionPool.component';
import AddEditConnectionPool from './_components/AddEditconnectionPool.component';
import DeleteConnectionPool from './_components/DeleteConnectionPool.component';
import Guides from '@/components/guides/Guides.component';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { GuideSections } from '@/types/guide';
import { useGetDatabases } from '@/hooks/api/database/database/useGetDatabases.hook';
import { useGetUsers } from '@/hooks/api/database/user/useGetUsers.hook';
import { useGetConnectionPools } from '@/hooks/api/database/connectionPool/useGetConnectionPools.hook';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-databases-analytics/services/service/connectionPools"
    />
  );
}

export interface ConnectionPoolWithData
  extends database.postgresql.ConnectionPool {
  database: database.service.Database;
  user: GenericUser;
}

const Pools = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/pools',
  );
  const { projectId, service } = useServiceData();
  const [connectionPoolListWithData, setConnectionPoolListWithData] = useState<
    ConnectionPoolWithData[]
  >([]);
  const { isUserActive } = useUserActivityContext();
  const addModale = useModale('add');
  const getInfoModale = useModale('information');
  const deleteModale = useModale('delete');
  const editModale = useModale('edit');
  const connectionPoolsQuery = useGetConnectionPools(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: isUserActive && POLLING.POOLS,
    },
  );
  const databasesQuery = useGetDatabases(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: isUserActive && POLLING.DATABASES,
    },
  );
  const usersQuery = useGetUsers(projectId, service.engine, service.id, {
    refetchInterval: isUserActive && POLLING.USERS,
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
        user: cp.userId
          ? usersQuery.data.find((user) => user.id === cp.userId)
          : null,
        database: databasesQuery.data.find((db) => db.id === cp.databaseId),
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
      <div className="flex justify-between w-full items-center">
        <h2>{t('title')}</h2>
        <Guides section={GuideSections.pools} engine={service.engine} />
      </div>
      <p>{t('description')}</p>
      {service.capabilities.connectionPools?.create && (
        <Button
          data-testid="pools-add-button"
          variant={'outline'}
          size="sm"
          className="text-base"
          onClick={() => addModale.open()}
          disabled={
            service.capabilities.connectionPools.create ===
            database.service.capability.StateEnum.disabled
          }
        >
          <Plus className="size-4 mr-2" />
          {t('addButtonLabel')}
        </Button>
      )}
      {connectionPoolsQuery.isSuccess && connectionPoolListWithData ? (
        <DataTable
          columns={columns}
          data={connectionPoolListWithData}
          pageSize={25}
        />
      ) : (
        <div data-testid="connectionPools-table-skeleton">
          <DataTable.Skeleton columns={5} rows={2} width={100} height={16} />
        </div>
      )}
      {connectionPoolsQuery.isSuccess &&
        usersQuery.isSuccess &&
        databasesQuery.isSuccess && (
          <AddEditConnectionPool
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
          <InfoConnectionPool
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
          <AddEditConnectionPool
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
