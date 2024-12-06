import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DataTable } from '@/components/data-table/data-table';
import * as database from '@/types/cloud/project/database';
import { Skeleton } from '@/components/ui/skeleton';
import { getColumns } from './ServiceListColumns.component';
import { useTrackAction } from '@/hooks/useTracking';
import { TRACKING } from '@/configuration/tracking.constants';
import { Button } from '@/components/ui/button';
import Link from '@/components/links/Link.component';
import { getFilters } from './ServiceListFilters.component';
import { DataTableHead } from '@/components/data-table/data-table-head';

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
    <>
      <DataTable
        columns={columns}
        data={services}
        pageSize={25}
        itemNumber={services.length}
        headerContent={(
          table,
          globalFilter,
          filters,
          addFilter,
          removeFilter,
        ) => (
          <DataTableHead
            actionButton={
              <Button
                data-testid="create-service-button"
                size="sm"
                className="text-base"
                asChild
              >
                <Link
                  to="./new"
                  className="hover:no-underline"
                  onClick={() =>
                    track(TRACKING.servicesList.createDatabaseClick())
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('createNewService')}
                </Link>
              </Button>
            }
            searchBar={{
              render: 'default',
              table,
              globalFilter,
            }}
            filterButton={{
              render: 'default',
              columnFilters: servicesFilters,
              addFilter,
            }}
            filterList={{
              render: 'default',
              filters,
              removeFilter,
            }}
          />
        )}
      ></DataTable>
    </>
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
