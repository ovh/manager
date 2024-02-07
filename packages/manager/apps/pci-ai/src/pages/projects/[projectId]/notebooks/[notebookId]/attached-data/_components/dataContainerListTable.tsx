import { ColumnDef } from '@tanstack/react-table';

import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/ui/data-table';

import { ai } from '@/models/types';
import { getColumns } from './dataContainerListColumns';

interface DataContainerListProps {
  volumes: ai.volume.Volume[];
  refetchFn: () => void;
}

export default function DataContainersList({
  volumes,
}: DataContainerListProps) {
  const columns: ColumnDef<ai.volume.Volume>[] = getColumns();

  return (
    <>
      <div>
        <DataTable columns={columns} data={volumes} pageSize={5} />
      </div>
    </>
  );
}

DataContainersList.Skeleton = function DataContainersListSkeleton() {
  return (
    <>
      <div className="flex justify-between w-100 mb-2 items-end">
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
