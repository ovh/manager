import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import * as database from '@/types/cloud/project/database';
import { Skeleton } from '@/components/ui/skeleton';
import { getColumns } from './ServiceListColumns.component';
import { useTrackAction } from '@/hooks/useTracking';
import { TRACKING } from '@/configuration/tracking.constants';

interface ServicesListProps {
  services: database.Service[];
  refetchFn: () => void;
}

export default function ServicesList({ services }: ServicesListProps) {
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

  return (
    <>
      <DataTable
        columns={columns}
        data={services}
        pageSize={25}
        itemNumber={services.length}
      />
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
