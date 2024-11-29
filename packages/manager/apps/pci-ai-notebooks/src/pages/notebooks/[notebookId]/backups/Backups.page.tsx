import { useTranslation } from 'react-i18next';
import { useNotebookData } from '../Notebook.context';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useGetBackups } from '@/hooks/api/ai/notebook/backups/useGetBackups.hook';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { POLLING } from '@/configuration/polling.constants';
import BackupsList from './_components/BackupsListTable.component';

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
  const { t } = useTranslation('pci-ai-notebooks/notebooks/notebook/backups');
  const { isUserActive } = useUserActivityContext();

  const backupsQuery = useGetBackups(projectId, notebook.id, {
    refetchInterval: isUserActive && POLLING.BACKUPS,
  });

  return (
    <>
      <h4>{t('title')}</h4>
      <p>{t('description')}</p>
      {backupsQuery.isSuccess && <BackupsList backups={backupsQuery.data} />}
    </>
  );
};

export default Backups;
