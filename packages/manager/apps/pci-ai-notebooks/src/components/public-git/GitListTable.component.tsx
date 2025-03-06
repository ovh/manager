import { ColumnDef } from '@tanstack/react-table';
import * as ai from '@/types/cloud/project/ai';
import { getColumns } from './GitListColumns.component';
import DataTable from '@/components/data-table';

interface GitListProps {
  git: ai.volume.Volume[];
  allowUpdate: boolean;
  deleteVol?: (volume: ai.volume.Volume) => void;
}

export default function GitList({
  git,
  allowUpdate,
  deleteVol,
}: Readonly<GitListProps>) {
  const columns: ColumnDef<ai.volume.Volume>[] = getColumns({
    onDeletVolume: (volume: ai.volume.Volume) => {
      deleteVol(volume);
    },
    updateMode: allowUpdate,
  });

  return <DataTable.Provider columns={columns} data={git} pageSize={25} />;
}
