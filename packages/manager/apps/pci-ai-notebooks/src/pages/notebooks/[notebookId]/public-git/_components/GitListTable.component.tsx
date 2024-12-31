import { ColumnDef } from '@tanstack/react-table';
import * as ai from '@/types/cloud/project/ai';
import { getColumns } from './GitListColumns.component';
import { DataTable } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';

interface GitListProps {
  git: ai.volume.Volume[];
}

export default function GitList({ git }: Readonly<GitListProps>) {
  const columns: ColumnDef<ai.volume.Volume>[] = getColumns();

  return <DataTable columns={columns} data={git} pageSize={25} />;
}

GitList.Skeleton = function GitListSkeleton() {
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
      <DataTable.Skeleton columns={3} rows={3} width={100} height={16} />
    </>
  );
};
