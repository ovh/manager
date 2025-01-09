import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import * as ai from '@/types/cloud/project/ai';
import { getColumns } from './VolumesListColumns.component';
import { DataTable } from '@/components/ui/data-table';
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

  return <DataTable columns={columns} data={volumes} pageSize={25} />;
}
