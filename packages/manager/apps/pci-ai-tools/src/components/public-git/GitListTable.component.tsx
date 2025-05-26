import { ColumnDef } from '@tanstack/react-table';
import { getColumns } from './GitListColumns.component';
import DataTable from '@/components/data-table';
import ai from '@/types/AI';

interface GitListProps {
  git: ai.volume.Volume[];
  volStatus: string;
  allowUpdate: boolean;
  deleteVol?: (volume: ai.volume.Volume) => void;
}

export default function GitList({
  git,
  volStatus,
  allowUpdate,
  deleteVol,
}: Readonly<GitListProps>) {
  const columns: ColumnDef<ai.volume.Volume>[] = getColumns({
    onDeletVolume: (volume: ai.volume.Volume) => {
      deleteVol(volume);
    },
    status: volStatus,
    updateMode: allowUpdate,
  });

  return <DataTable.Provider columns={columns} data={git} pageSize={25} />;
}
