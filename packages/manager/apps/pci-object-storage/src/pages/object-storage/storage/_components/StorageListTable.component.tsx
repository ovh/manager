import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Skeleton, Button } from '@datatr-ux/uxlib';
import { getColumns } from './StorageListColumns.component';
import DataTable from '@/components/data-table';
import { getFilters } from './StorageListFilters.component';
import { FormattedStorage, ObjectStorageTypeEnum } from '@/types/Storages';

interface StoragesListProps {
  storages: FormattedStorage[];
}

export default function StoragesList({ storages }: StoragesListProps) {
  const { t } = useTranslation('pci-object-storage/storages');
  const navigate = useNavigate();
  const columns: ColumnDef<FormattedStorage>[] = getColumns({
    onSwitchClicked: (storage: FormattedStorage) => {
      navigate(`./switch-type/${storage.id}`);
    },
    onDeleteClicked: (storage: FormattedStorage) => {
      return storage.storageType === ObjectStorageTypeEnum.s3
        ? navigate(
            `./delete/${storage.storageType}/${storage.name}/${storage.region}`,
          )
        : navigate(
            `./delete/${storage.storageType}/${storage.id}/${storage.region}`,
          );
    },
    onAddUserClicked: (storage: FormattedStorage) => {
      navigate(
        `./add-s3-user/${storage.storageType}/${storage.name}/${storage.region}`,
      );
    },
  });
  const storagesFilters = getFilters();

  return (
    <DataTable.Provider
      columns={columns}
      data={storages}
      pageSize={25}
      filtersDefinition={storagesFilters}
    >
      <DataTable.Header>
        <DataTable.Action>
          <Button
            data-testid="create-service-button"
            onClick={() => {
              navigate('./new');
            }}
          >
            <Plus className="size-6 mr-2 text-primary-foreground" />
            {t('createNewStorage')}
          </Button>
        </DataTable.Action>
        <DataTable.SearchBar />
        <DataTable.FiltersButton />
      </DataTable.Header>
      <DataTable.FiltersList />
      <DataTable.Table />
      <DataTable.Pagination />
    </DataTable.Provider>
  );
}

StoragesList.Skeleton = function StoragesListSkeleton() {
  return (
    <>
      <div
        data-testid="service-list-table-skeleton"
        className="flex justify-between w-100 mb-2 items-end"
      >
        <Skeleton className="h-10 w-48" />
        <div className="flex">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-12 ml-2" />
        </div>
      </div>
      <DataTable.Skeleton columns={5} rows={10} width={100} height={16} />
    </>
  );
};
