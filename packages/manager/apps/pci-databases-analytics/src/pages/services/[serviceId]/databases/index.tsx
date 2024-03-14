import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import BreadcrumbItem from '@/components/Breadcrumb/BreadcrumbItem';
import { H2 } from '@/components/typography';
import { database } from '@/models/database';
import { useServiceData } from '../layout';
import { DataTable } from '@/components/ui/data-table';
import { getColumns } from './_components/databasesTableColumns';
import { useGetDatabases } from '@/hooks/api/databases.api.hook';
import { Button } from '@/components/ui/button';
import { useModale } from '@/hooks/useModale';
import AddDatabase from './_components/addDatabase';
import DeleteDatabase from './_components/deleteDatabase';
import { POLLING } from '@/configuration/polling';

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
  const databasesQuery = useGetDatabases(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: POLLING.DATABASES,
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
      <H2>{t('title')}</H2>

      <Button
        variant={'outline'}
        size="sm"
        className="text-base"
        disabled={
          service.capabilities.databases?.create ===
          database.service.capability.StateEnum.disabled
        }
        onClick={() => addModale.open()}
      >
        <Plus className="w-4 h-4 mr-2" />
        {t('addButtonLabel')}
      </Button>

      {databasesQuery.isSuccess ? (
        <DataTable columns={columns} data={databasesQuery.data} pageSize={25} />
      ) : (
        <DataTable.Skeleton columns={3} rows={5} width={100} height={16} />
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
