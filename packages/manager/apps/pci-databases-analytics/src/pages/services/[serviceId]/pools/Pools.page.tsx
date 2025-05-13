import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@datatr-ux/uxlib';
import DataTable from '@/components/data-table';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useServiceData } from '../Service.context';
import { POLLING } from '@/configuration/polling.constants';
import { GenericUser } from '@/data/api/database/user.api';
import * as database from '@/types/cloud/project/database';
import { getColumns } from './_components/PoolsTableColumns.component';
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
  const navigate = useNavigate();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/pools',
  );
  const { projectId, service } = useServiceData();
  const { isUserActive } = useUserActivityContext();
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

  const connectionPoolListWithData = useMemo(() => {
    if (
      !(
        connectionPoolsQuery.isSuccess &&
        usersQuery.isSuccess &&
        databasesQuery.isSuccess
      )
    )
      return [];

    return connectionPoolsQuery.data.map((cp) => ({
      ...cp,
      user: cp.userId
        ? usersQuery.data.find((user) => user.id === cp.userId)
        : null,
      database: databasesQuery.data.find((db) => db.id === cp.databaseId),
    }));
  }, [
    connectionPoolsQuery.isSuccess,
    connectionPoolsQuery.data,
    usersQuery.isSuccess,
    usersQuery.data,
    databasesQuery.isSuccess,
    databasesQuery.data,
  ]);

  const columns: ColumnDef<ConnectionPoolWithData>[] = getColumns({
    onGetInformationClick: (pool: ConnectionPoolWithData) =>
      navigate(`./informations/${pool.id}`),
    onEditClick: (pool: ConnectionPoolWithData) =>
      navigate(`./edit/${pool.id}`),
    onDeleteClick: (pool: ConnectionPoolWithData) =>
      navigate(`./delete/${pool.id}`),
  });

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
          mode={'outline'}
          size="sm"
          className="text-base"
          onClick={() => navigate('./add')}
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
        <DataTable.Provider
          columns={columns}
          data={connectionPoolListWithData}
          pageSize={25}
        />
      ) : (
        <div data-testid="connectionPools-table-skeleton">
          <DataTable.Skeleton columns={5} rows={2} width={100} height={16} />
        </div>
      )}
      <Outlet />
    </>
  );
};

export default Pools;
