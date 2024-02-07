import { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';

import { ai } from '@/models/types';
import { getColumns } from './gitRepositoryListColumns';

interface GitRepositoryListProps {
  volumes: ai.volume.Volume[];
}

export default function GitRepositoryList({
  volumes,
}: GitRepositoryListProps ) {

  // define api links
  const columns: ColumnDef<ai.volume.Volume>[] = getColumns();

  return (
    <>
        <div>
          <DataTable columns={columns} data={volumes} pageSize={5} />
        </div>
      </>
  );
}

GitRepositoryList.Skeleton = function GitRepositoryListSkeleton() {
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
