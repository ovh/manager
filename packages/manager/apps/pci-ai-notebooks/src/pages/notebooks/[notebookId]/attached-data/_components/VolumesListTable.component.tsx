import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useModale } from '@/hooks/useModale';
import * as ai from '@/types/cloud/project/ai';
import { getColumns } from './VolumesListColumns.component';
import { DataTable } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import DataSync from './DataSync.component';

interface VolumesListProps {
  volumes: ai.volume.Volume[];
}

export default function VolumesList({ volumes }: Readonly<VolumesListProps>) {
  const dataSyncModale = useModale('datasync');

  const dataSyncVolume: ai.volume.Volume = useMemo(
    () =>
      volumes.find(
        (vol) => vol.volumeSource.dataStore.container === dataSyncModale.value,
      ),
    [dataSyncModale.value, volumes],
  );

  const columns: ColumnDef<ai.volume.Volume>[] = getColumns({
    onDataSyncClicked: (volume: ai.volume.Volume) => {
      dataSyncModale.open(volume.volumeSource.dataStore.container);
    },
  });

  return (
    <>
      <DataTable columns={columns} data={volumes} pageSize={25} />
      {dataSyncVolume && (
        <DataSync
          controller={dataSyncModale.controller}
          volume={dataSyncVolume}
          onSuccess={() => {
            dataSyncModale.close();
          }}
        />
      )}
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
