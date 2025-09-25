import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Skeleton, Button } from '@datatr-ux/uxlib';
import { getColumns } from './ContainerListColumns.component';
import DataTable from '@/components/data-table';
import { getFilters } from './ContainerListFilters.component';
import { Containers } from '@/types/Storages';

interface ContainersListProps {
  containers: Containers[];
}

export default function ContainersList({ containers }: ContainersListProps) {
  const { t } = useTranslation('pci-object-storage/containers');
  const navigate = useNavigate();
  const columns: ColumnDef<Containers>[] = getColumns({
    onSwitchClicked: (container: Containers) => {
      navigate(`./switch/${container.id}`);
    },
    onDeleteClicked: (container: Containers) => {
      navigate(`./delete/${container.id}`);
    },
  });
  const containersFilters = getFilters();

  return (
    <DataTable.Provider
      columns={columns}
      data={containers}
      pageSize={25}
      filtersDefinition={containersFilters}
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
            {t('createNewContainer')}
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

ContainersList.Skeleton = function ContainersListSkeleton() {
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
