import { useTranslation } from 'react-i18next';
import { add } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { H2, Link, P } from '@/components/typography';
import { database } from '@/models/database';
import { useServiceData } from '../layout';
import { getColumns } from './_components/backupsTableColumns';
import { DataTable } from '@/components/ui/data-table';
import { useGetBackups } from '@/hooks/api/backups.api.hooks';
import { POLLING } from '@/configuration/polling';

import { Button } from '@/components/ui/button';
import { useModale } from '@/hooks/useModale';
import RestoreServiceModal from './_components/restore';

export interface BackupWithExpiricyDate extends database.Backup {
  expiricyDate: Date;
}
const Backups = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/backups',
  );
  const restoreModal = useModale('restore');
  const navigate = useNavigate();
  const { projectId, service } = useServiceData();
  const backupsQuery = useGetBackups(projectId, service.engine, service.id, {
    refetchInterval: POLLING.BACKUPS,
  });
  // const [selectedBackup, setSelectedBackup] = useState<database.Backup | undefined>();
  const columns = getColumns({
    onRestoreClick: (backup) => {
      restoreModal.open(backup.id);
    },
    onForkClick: (backup) => {
      navigate(`fork?backup=${backup.id}`);
    },
  });

  const selectedBackup = backupsQuery.data?.find(
    (b) => b.id === restoreModal.value,
  );
  return (
    <>
      <H2>{t('title')}</H2>
      <P>{t('description')}</P>

      <div className="flex gap-2">
        {/* TODO: add capability in API */}
        <Button variant="outline" size="sm" className="text-base" asChild>
          <Link to="./fork" className="hover:no-underline">
            {t('actionFork')}
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-base"
          onClick={() => restoreModal.open()}
        >
          {t('actionRestore')}
        </Button>
      </div>

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

      {backupsQuery.data && (
        <RestoreServiceModal
          controller={restoreModal.controller}
          backup={selectedBackup}
          backups={backupsQuery.data}
        />
      )}
    </>
  );
};

export default Backups;
