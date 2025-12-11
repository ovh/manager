import { useTranslation } from 'react-i18next';
import { add } from 'date-fns';
import { Outlet, useNavigate } from 'react-router-dom';
import { CopyPlus, DatabaseBackup, Pen } from 'lucide-react';
import { Button } from '@datatr-ux/uxlib';
import Link from '@/components/links/Link.component';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../Service.context';
import { getColumns } from './_components/BackupsTableColumns.component';
import { POLLING } from '@/configuration/polling.constants';
import Guides from '@/components/guides/Guides.component';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { GuideSections } from '@/types/guide';
import { useGetBackups } from '@/hooks/api/database/backup/useGetBackups.hook';
import DataTable from '@/components/data-table';

export interface BackupWithExpiricyDate extends database.Backup {
  expiricyDate: Date;
}
const Backups = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/backups',
  );
  const navigate = useNavigate();
  const { projectId, service } = useServiceData();
  const { isUserActive } = useUserActivityContext();
  const backupsQuery = useGetBackups(projectId, service.engine, service.id, {
    refetchInterval: isUserActive && POLLING.BACKUPS,
  });
  const columns = getColumns({
    onRestoreClick: (backup) => {
      navigate(`./restore/${backup.id}`);
    },
    onForkClick: (backup) => {
      navigate(`fork?backup=${backup.id}`);
    },
  });

  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('title')}</h2>
        <Guides section={GuideSections.backups} engine={service.engine} />
      </div>
      <p>{t('description')}</p>

      <table
        className="border-b border-gray-200 border-collapse my-4"
        data-testid="backups-table"
      >
        <tbody>
          {/* Ligne RetentionDays */}
          <tr className="border-b border-gray-200">
            <td className="font-semibold px-4 py-2">
              {t('detailsRetentionDays')}
            </td>
            <td className="px-4 py-2">
              {t('detailsRetentionDaysUnit', {
                number: service.backups?.retentionDays,
              })}
            </td>
          </tr>
          {/* Ligne BackupTime */}
          <tr className="border-b border-gray-200">
            <td className="font-semibold px-4 py-2">
              {t('detailsBackupTime')}
            </td>
            <td className="px-4 py-2">
              <div className="flex flex-row gap-4 items-center">
                <span>{service.backups?.time}</span>
                <Button
                  type="button"
                  mode="ghost"
                  className="rounded-full aspect-square h-6 w-6"
                >
                  <Link to="./../settings">
                    <Pen className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {backupsQuery.isSuccess ? (
        <DataTable.Provider
          columns={columns}
          data={backupsQuery.data.map((backup) => ({
            ...backup,
            expiricyDate: add(new Date(backup.createdAt), {
              days: service.backups.retentionDays,
            }),
          }))}
          pageSize={25}
        >
          <DataTable.Header>
            {service.capabilities.fork?.create  && (
              <DataTable.Action>
                <div className="flex gap-2 mt-4">
                  {service.capabilities.fork?.create && (
                    <Button
                      data-testid="fork-button"
                      disabled={
                        service.capabilities.fork.create ===
                        database.service.capability.StateEnum.disabled
                      }
                      mode="outline"
                    >
                      <Link
                        to="./fork"
                        className="hover:no-underline flex flex-row gap-2 items-center"
                      >
                        <CopyPlus className="w-4 h-4" />
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
                      mode="outline"
                      onClick={() => navigate('./restore')}
                    >
                      <DatabaseBackup className="w-4 h-4" />
                      {t('actionRestore')}
                    </Button>
                  )}
                </div>
              </DataTable.Action>
            )}
          </DataTable.Header>
          <DataTable.Table />
          <DataTable.Pagination />
        </DataTable.Provider>
      ) : (
        <div data-testid="skeleton-container-backup">
          <DataTable.Skeleton columns={5} rows={5} width={100} height={16} />
        </div>
      )}
      <Outlet />
    </>
  );
};

export default Backups;
