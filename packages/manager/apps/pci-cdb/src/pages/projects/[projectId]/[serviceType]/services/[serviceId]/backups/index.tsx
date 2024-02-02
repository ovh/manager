import { add } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { H2 } from '@/components/typography';
import { useServiceData } from '../serviceData.hook';
import { useGetBackups } from '@/hooks/api/backups.api.hooks';
import { DataTable } from '@/components/ui/data-table';
import { database } from '@/models/database';
import { getColumns } from './_components/backupsTableColumns';

export const Handle = {
  breadcrumb: () => 'Backups',
};

export interface BackupWithExpiricyDate extends database.Backup {
  expiricyDate: Date;
}
const BackupsPage = () => {
  const { projectId, service } = useServiceData();
  const retentionDays = 3; // TODO: get it from api
  const backupsQuery = useGetBackups(projectId, service.engine, service.id, {
    refetchInterval: 30_000,
  });
  const columns: ColumnDef<BackupWithExpiricyDate>[] = getColumns();
  return (
    <>
      <H2>Backups</H2>
      {backupsQuery.isSuccess ? (
        <>
          <DataTable
            columns={columns}
            data={backupsQuery.data.map((backup) => ({
              ...backup,
              expiricyDate: add(new Date(backup.createdAt), { days: retentionDays }),
            }))}
            pageSize={25}
          />
        </>
      ) : (
        <DataTable.Skeleton columns={5} rows={5} width={100} height={16} />
      )}
    </>
  );
};

export default BackupsPage;
