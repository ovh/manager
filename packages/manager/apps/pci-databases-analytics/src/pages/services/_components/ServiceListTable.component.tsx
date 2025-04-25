import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Skeleton, Button } from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import { getColumns } from './ServiceListColumns.component';
import { useTrackAction } from '@/hooks/useTracking';
import { TRACKING } from '@/configuration/tracking.constants';
import { getFilters } from './ServiceListFilters.component';
import DataTable from '@/components/data-table';

interface ServicesListProps {
  services: database.Service[];
}

export default function ServicesList({ services }: ServicesListProps) {
  const { t } = useTranslation('pci-databases-analytics/services');
  const track = useTrackAction();

  const navigate = useNavigate();

  const columns: ColumnDef<database.Service>[] = getColumns({
    onRenameClicked: (service: database.Service) => {
      track(TRACKING.servicesList.renameClick(service.engine));
      navigate(`./rename/${service.id}`);
    },
    onDeleteClicked: (service: database.Service) => {
      track(
        TRACKING.servicesList.deleteClick(
          service.engine,
          service.nodes[0].region,
        ),
      );
      navigate(`./delete/${service.id}`);
    },
  });
  const servicesFilters = getFilters();

  return (
    <DataTable.Provider
      columns={columns}
      data={services}
      pageSize={25}
      filtersDefinition={servicesFilters}
    >
      <DataTable.Header>
        <DataTable.Action>
          <Button
            data-testid="create-service-button"
            onClick={() => {
              track(TRACKING.servicesList.createDatabaseClick());
              navigate('./new');
            }}
          >
            <Plus className="size-6 mr-2 text-primary-foreground" />
            {t('createNewService')}
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

ServicesList.Skeleton = function ServicesListSkeleton() {
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
