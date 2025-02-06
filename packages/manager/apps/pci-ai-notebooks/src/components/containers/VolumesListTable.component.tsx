import { ColumnDef } from '@tanstack/react-table';
import * as ai from '@/types/cloud/project/ai';
import { getColumns } from './VolumesListColumns.component';
import DataTable from '@/components/data-table';

interface VolumesListProps {
  volumes: ai.volume.Volume[];
  volStatus: string;
  dataSync: (volume: ai.volume.Volume) => void;
}

export default function VolumesList({
  volumes,
  volStatus,
  dataSync,
}: Readonly<VolumesListProps>) {
  const columns: ColumnDef<ai.volume.Volume>[] = getColumns({
    onDataSyncClicked: (volume: ai.volume.Volume) => {
      dataSync(volume);
    },
    status: volStatus,
  });

  return <DataTable.Provider columns={columns} data={volumes} pageSize={25} />;
}
