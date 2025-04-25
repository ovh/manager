import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@datatr-ux/uxlib';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../Service.context';
import DataTable from '@/components/data-table';
import { getColumns } from './_components/DatabasesTableColumns.component';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { POLLING } from '@/configuration/polling.constants';
import { useGetDatabases } from '@/hooks/api/database/database/useGetDatabases.hook';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-databases-analytics/services/service/databases"
    />
  );
}

const Databases = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/databases',
  );
  const navigate = useNavigate();
  const { projectId, service } = useServiceData();
  const { isUserActive } = useUserActivityContext();
  const databasesQuery = useGetDatabases(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: isUserActive && POLLING.DATABASES,
    },
  );
  const columns: ColumnDef<database.service.Database>[] = getColumns({
    onDeleteClick: (db: database.service.Database) =>
      navigate(`./delete/${db.id}`),
  });
  return (
    <>
      <h2>{t('title')}</h2>
      {service.capabilities.databases?.create && (
        <Button
          mode={'outline'}
          size="sm"
          className="text-base"
          data-testid="add-button"
          disabled={
            service.capabilities.databases?.create ===
            database.service.capability.StateEnum.disabled
          }
          onClick={() => navigate('./add')}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('addButtonLabel')}
        </Button>
      )}

      {databasesQuery.isSuccess ? (
        <DataTable.Provider
          columns={columns}
          data={databasesQuery.data}
          pageSize={10}
        />
      ) : (
        <div data-testid="table-skeleton">
          <DataTable.Skeleton columns={3} rows={5} width={100} height={16} />
        </div>
      )}

      <Outlet />
    </>
  );
};

export default Databases;
