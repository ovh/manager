import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../Service.context';
import { DataTable } from '@/components/ui/data-table';
import { getColumns } from './_components/DatabasesTableColumns.component';
import { Button } from '@/components/ui/button';
import { useModale } from '@/hooks/useModale';
import AddDatabase from './_components/AddDatabase.component';
import DeleteDatabase from './_components/DeleteDatabase.component';
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
  const addModale = useModale('add');
  const deleteModale = useModale('delete');
  const { projectId, service, serviceQuery } = useServiceData();
  const { isUserActive } = useUserActivityContext();
  const databasesQuery = useGetDatabases(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: isUserActive && POLLING.DATABASES,
    },
  );
  const deletingDatabase = databasesQuery.data?.find(
    (d) => d.id === deleteModale.value,
  );
  const columns: ColumnDef<database.service.Database>[] = getColumns({
    onDeleteClick: (db: database.service.Database) => deleteModale.open(db.id),
  });
  return (
    <>
      <h2>{t('title')}</h2>
      {service.capabilities.databases?.create && (
        <Button
          variant={'outline'}
          size="sm"
          className="text-base"
          data-testid="add-button"
          disabled={
            service.capabilities.databases?.create ===
            database.service.capability.StateEnum.disabled
          }
          onClick={() => addModale.open()}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('addButtonLabel')}
        </Button>
      )}

      {databasesQuery.isSuccess ? (
        <DataTable columns={columns} data={databasesQuery.data} pageSize={25} />
      ) : (
        <div data-testid="table-skeleton">
          <DataTable.Skeleton columns={3} rows={5} width={100} height={16} />
        </div>
      )}

      <AddDatabase
        controller={addModale.controller}
        service={service}
        onSuccess={() => {
          addModale.close();
          databasesQuery.refetch();
          serviceQuery.refetch();
        }}
      />

      {deletingDatabase && (
        <DeleteDatabase
          controller={deleteModale.controller}
          service={service}
          database={deletingDatabase}
          onSuccess={() => {
            deleteModale.close();
            databasesQuery.refetch();
          }}
        />
      )}
    </>
  );
};

export default Databases;
