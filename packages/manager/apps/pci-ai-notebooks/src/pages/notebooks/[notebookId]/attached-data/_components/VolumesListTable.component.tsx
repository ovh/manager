import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import * as ai from '@/types/cloud/project/ai';
import { getColumns } from './VolumesListColumns.component';
import { DataTable } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotebookData } from '../../Notebook.context';

interface VolumesListProps {
  volumes: ai.volume.Volume[];
}

export default function VolumesList({ volumes }: Readonly<VolumesListProps>) {
  const { notebook } = useNotebookData();
  const navigate = useNavigate();
  const columns: ColumnDef<ai.volume.Volume>[] = getColumns({
    onDataSyncClicked: (volume: ai.volume.Volume) => {
      const volumeId = notebook.status.volumes.find(
        (vol) => vol.mountPath === volume.mountPath,
      ).id;
      navigate(`./data-sync/${volumeId}`);
    },
  });

  return (
    <>
      <DataTable columns={columns} data={volumes} pageSize={25} />
    </>
  );
}

VolumesList.Skeleton = function VolumesListSkeleton() {
  return (
    <>
      <div
        data-testid="volume-list-table-skeleton"
        className="flex justify-between w-100 mb-2 items-end"
      >
        <Skeleton className="h-10 w-48" />
        <div className="flex">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-12 ml-2" />
        </div>
      </div>
      <DataTable.Skeleton columns={5} rows={3} width={100} height={16} />
    </>
  );
};
