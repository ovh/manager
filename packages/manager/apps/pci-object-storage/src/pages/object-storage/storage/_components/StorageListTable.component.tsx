import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Skeleton, Button } from '@datatr-ux/uxlib';
import { useGetColumns } from './StorageListColumns.component';
import DataTable from '@/components/data-table';
import { useGetFilters } from './StorageListFilters.component';
import { FormattedStorage, ObjectStorageTypeEnum } from '@/types/Storages';

interface StoragesListProps {
  storages: FormattedStorage[];
}

export default function StoragesList({ storages }: StoragesListProps) {
  const { t } = useTranslation('pci-object-storage/storages');
  const navigate = useNavigate();
  const columns: ColumnDef<FormattedStorage>[] = useGetColumns({
    onSwitchClicked: (storage: FormattedStorage) => {
      navigate(`./switch-type/${storage.id}`);
    },
    onDeleteClicked: (storage: FormattedStorage) => {
      return storage.storageType === ObjectStorageTypeEnum.s3
        ? navigate(`./delete/${storage.name}/${storage.region}`)
        : navigate(`./delete/${storage.id}`);
    },
    onAddUserClicked: (storage: FormattedStorage) => {
      navigate(
        `./add-s3-user/${storage.storageType}/${storage.name}/${storage.region}`,
      );
    },
  });
  const regionNames = storages.reduce<string[]>((acc, storage) => {
    if (storage.regionObj?.name && !acc.includes(storage.regionObj.name)) {
      acc.push(storage.regionObj.name);
    }
    return acc;
  }, []);

  const storagesFilters = useGetFilters(regionNames);

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
            data-testid="create-storage-button"
            onClick={() => {
              navigate('./new');
            }}
          >
            <Plus className="size-6" />
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
