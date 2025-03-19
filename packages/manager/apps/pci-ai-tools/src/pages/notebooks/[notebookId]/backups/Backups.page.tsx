import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { useNotebookData } from '../Notebook.context';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { POLLING } from '@/configuration/polling.constants';
import BackupsList from './_components/BackupsListTable.component';
import { useGetBackups } from '@/data/hooks/ai/notebook/backups/useGetBackups.hook';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-ai-notebooks/notebooks/notebook/backups"
    />
  );
}

const Backups = () => {
  const { projectId, notebook } = useNotebookData();
  const { t } = useTranslation('ai-tools/notebooks/notebook/backups');
  const { isUserActive } = useUserActivityContext();

  const backupsQuery = useGetBackups(projectId, notebook.id, {
    refetchInterval: isUserActive && POLLING.BACKUPS,
  });

  return (
    <>
      <h2>{t('title')}</h2>
      <p>{t('description')}</p>
      {backupsQuery.isSuccess ? (
        <BackupsList backups={backupsQuery.data} />
      ) : (
        <BackupsList.Skeleton />
      )}
      <Outlet />
    </>
  );
};

export default Backups;
