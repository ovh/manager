import { useTranslation } from 'react-i18next';
import { add } from 'date-fns';
import { Outlet, useNavigate } from 'react-router-dom';
import { CopyPlus, DatabaseBackup, Pen } from 'lucide-react';
import { Button } from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../Service.context';
import { getColumns } from './_components/BackupsTableColumns.component';
import { POLLING } from '@/configuration/polling.constants';
import Guides from '@/components/guides/Guides.component';
import { useUserActivityContext } from '@/contexts/UserActivity.context';
import { GuideSections } from '@/types/guide';
import { useGetBackups } from '@/data/hooks/database/backup/useGetBackups.hook';
import DataTable from '@/components/data-table';
import { isCapabilityDisabled } from '@/lib/capabilitiesHelper';
import NavLink from '@/components/links/NavLink.component';

export interface BackupWithExpiryDate extends database.Backup {
  expiryDate: Date;
}
const ListBackups = () => {
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
          {service.capabilities.backupTime?.read && (
            <tr className="border-b border-gray-200">
              <td className="font-semibold px-4 py-2">
                {t('detailsBackupTime')}
              </td>
              <td className="px-4 py-2">
                <div className="flex flex-row gap-4 items-center">
                  <span>{service.backups?.time}</span>
                  {service.capabilities.backupTime?.update && (
                    <NavLink
                      className="rounded-full aspect-square h-6 w-6 pt-1"
                      to="./../settings"
                      disabled={isCapabilityDisabled(
                        service,
                        'backupTime',
                        'update',
                      )}
                    >
                      <Pen className="w-4 h-4" />
                    </NavLink>
                  )}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {backupsQuery.isSuccess ? (
        <DataTable.Provider
          columns={columns}
          data={backupsQuery.data.map((backup) => ({
            ...backup,
            expiryDate: add(new Date(backup.createdAt), {
              days: service.backups.retentionDays,
            }),
          }))}
          pageSize={25}
        >
          <DataTable.Header>
            {service.capabilities.fork?.create && (
              <DataTable.Action>
                <div className="flex gap-2 mt-4">
                  {service.capabilities.fork?.create && (
                    <Button
                      data-testid="fork-button"
                      disabled={isCapabilityDisabled(service, 'fork', 'create')}
                      mode="outline"
                      onClick={() => navigate('./fork')}
                    >
                      <CopyPlus className="w-4 h-4" />
                      {t('actionFork')}
                    </Button>
                  )}
                  {service.capabilities.backupRestore?.create && (
                    <Button
                      data-testid="restore-backup-button"
                      disabled={isCapabilityDisabled(
                        service,
                        'backupRestore',
                        'create',
                      )}
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

export default ListBackups;
