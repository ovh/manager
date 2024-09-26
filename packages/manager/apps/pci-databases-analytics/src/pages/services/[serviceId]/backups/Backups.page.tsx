import { useTranslation } from 'react-i18next';
import { add } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Pen } from 'lucide-react';
import Link from '@/components/links/Link.component';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../Service.context';
import { getColumns } from './_components/BackupsTableColumns.component';
import { DataTable } from '@/components/ui/data-table';
import { POLLING } from '@/configuration/polling.constants';
import { Button } from '@/components/ui/button';
import { useModale } from '@/hooks/useModale';
import RestoreServiceModal from './_components/Restore.component';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import Guides from '@/components/guides/Guides.component';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { GuideSections } from '@/types/guide';
import { useGetBackups } from '@/hooks/api/database/backup/useGetBackups.hook';

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
  const { isUserActive } = useUserActivityContext();
  const backupsQuery = useGetBackups(projectId, service.engine, service.id, {
    refetchInterval: isUserActive && POLLING.BACKUPS,
  });
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
      <div className="flex justify-between w-full items-center">
        <h2>{t('title')}</h2>
        <Guides section={GuideSections.backups} engine={service.engine} />
      </div>
      <p>{t('description')}</p>
      <div className="inline-block">
        <Table>
          <TableBody data-testid="backups-table">
            <TableRow>
              <TableCell className="font-semibold">
                {t('detailsRetentionDays')}
              </TableCell>
              <TableCell>
                {t('detailsRetentionDaysUnit', {
                  number: service.backups?.retentionDays,
                })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">
                {t('detailsBackupTime')}
              </TableCell>
              <TableCell>{service.backups?.time}</TableCell>
              <TableCell>
                <Button type="button" size="table" variant="table">
                  <Link to="./../settings">
                    <Pen className="w-4 h-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
            <TableRow />
          </TableBody>
        </Table>
      </div>
      <div className="flex gap-2">
        {service.capabilities.fork?.create && (
          <Button
            data-testid="fork-button"
            disabled={
              service.capabilities.fork.create ===
              database.service.capability.StateEnum.disabled
            }
            variant="outline"
            size="sm"
            className="text-base"
            asChild
          >
            <Link to="./fork" className="hover:no-underline">
              {t('actionFork')}
            </Link>
          </Button>
        )}
        {service.capabilities.backupRestore?.create && (
          <Button
            data-testid="restore-backup-button"
            disabled={
              service.capabilities.backupRestore.create ===
              database.service.capability.StateEnum.disabled
            }
            variant="outline"
            size="sm"
            className="text-base"
            onClick={() => restoreModal.open()}
          >
            {t('actionRestore')}
          </Button>
        )}
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
        <div data-testid="skeleton-container-backup">
          <DataTable.Skeleton columns={5} rows={5} width={100} height={16} />
        </div>
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
