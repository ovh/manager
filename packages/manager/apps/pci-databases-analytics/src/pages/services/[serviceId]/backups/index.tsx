import { useTranslation } from 'react-i18next';
import { add } from 'date-fns';
import BreadcrumbItem from '@/components/Breadcrumb/BreadcrumbItem';
import { H2, P } from '@/components/typography';
import { database } from '@/models/database';
import { useServiceData } from '../layout';
import { getColumns } from './_components/backupsTableColumns';
import { DataTable } from '@/components/ui/data-table';
import { useGetBackups } from '@/hooks/api/backups.api.hooks';
import { POLLING } from '@/configuration/polling';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-databases-analytics/services/service/backups"
    />
  );
}

export interface BackupWithExpiricyDate extends database.Backup {
  expiricyDate: Date;
}
const Backups = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/backups',
  );
  const { projectId, service } = useServiceData();
  const backupsQuery = useGetBackups(projectId, service.engine, service.id, {
    refetchInterval: POLLING.BACKUPS,
  });
  const columns = getColumns();
  return (
    <>
      <H2 className="mb-2">{t('title')}</H2>
      <P className="mb-2">{t('description')}</P>
      {backupsQuery.isSuccess ? (
        <DataTable
          columns={columns}
          data={backupsQuery.data.map((backup) => ({
            ...backup,
            expiricyDate: add(new Date(backup.createdAt), {
              days: service.backups.retentionDays,
            }),
          }))}
          pageSize={25}
        />
      ) : (
        <DataTable.Skeleton columns={5} rows={5} width={100} height={16} />
      )}
    </>
  );
};

export default Backups;
