import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { useModale } from '@/hooks/useModale';
import * as ai from '@/types/cloud/project/ai';
import { getColumns } from './BackupsListColumns.component';
import { DataTable } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import Fork from './Fork.component';

interface BackupsListProps {
  backups: ai.notebook.Backup[];
}

export default function BackupsList({ backups }: Readonly<BackupsListProps>) {
  const forkModale = useModale('fork');
  const navigate = useNavigate();
  const forkBackup: ai.notebook.Backup = useMemo(
    () => backups.find((backup) => backup.id === forkModale.value),
    [forkModale.value, backups],
  );

  const columns: ColumnDef<ai.notebook.Backup>[] = getColumns({
    onForkClicked: (backup: ai.notebook.Backup) => {
      forkModale.open(backup.id);
    },
  });

  return (
    <>
      <DataTable columns={columns} data={backups} pageSize={25} />
      {forkBackup && (
        <Fork
          controller={forkModale.controller}
          backup={forkBackup}
          onSuccess={(newNotebook: ai.notebook.Notebook) => {
            forkModale.close();
            navigate(`../../${newNotebook.id}`);
          }}
        />
      )}
    </>
  );
}

BackupsList.Skeleton = function BackupsListSkeleton() {
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
