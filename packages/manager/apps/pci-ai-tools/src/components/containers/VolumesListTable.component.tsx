import { ColumnDef } from '@tanstack/react-table';
import ai from '@/types/AI';
import { getColumns } from './VolumesListColumns.component';
import DataTable from '@/components/data-table';

interface VolumesListProps {
  volumes: ai.volume.Volume[];
  volStatus: string;
  allowUpdate: boolean;
  dataSync: (volume: ai.volume.Volume) => void;
  deleteVol?: (volume: ai.volume.Volume) => void;
}

export default function VolumesList({
  volumes,
  volStatus,
  allowUpdate,
  dataSync,
  deleteVol,
}: Readonly<VolumesListProps>) {
  const columns: ColumnDef<ai.volume.Volume>[] = getColumns({
    onDataSyncClicked: (volume: ai.volume.Volume) => {
      dataSync(volume);
    },
    onDeletVolume: (volume: ai.volume.Volume) => {
      deleteVol(volume);
    },
    status: volStatus,
    updateMode: allowUpdate,
  });

  return <DataTable.Provider columns={columns} data={volumes} pageSize={25} />;
}
