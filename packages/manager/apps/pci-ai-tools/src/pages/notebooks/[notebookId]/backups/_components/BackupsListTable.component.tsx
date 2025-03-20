import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import { getColumns } from './BackupsListColumns.component';
import DataTable from '@/components/data-table';

interface BackupsListProps {
  backups: ai.notebook.Backup[];
}

export default function BackupsList({ backups }: Readonly<BackupsListProps>) {
  const navigate = useNavigate();

  const columns: ColumnDef<ai.notebook.Backup>[] = getColumns({
    onForkClicked: (backup: ai.notebook.Backup) => {
      navigate(`./fork/${backup.id}`);
    },
  });

  return <DataTable.Provider columns={columns} data={backups} pageSize={25} />;
}

BackupsList.Skeleton = function BackupsListSkeleton() {
  return (
    <>
      <div
        data-testid="backup-list-table-skeleton"
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
