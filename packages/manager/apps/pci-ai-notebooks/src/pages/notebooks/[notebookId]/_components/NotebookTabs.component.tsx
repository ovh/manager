import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';
import * as ai from '@/types/cloud/project/ai';
import { useGetBackups } from '@/hooks/api/ai/notebook/backups/useGetBackups.hook';
import { POLLING } from '@/configuration/polling.constants';
import { useUserActivityContext } from '@/contexts/UserActivityContext';

interface NotebookTabsProps {
  notebook: ai.notebook.Notebook;
}

const NotebookTabs = ({ notebook }: NotebookTabsProps) => {
  const { t } = useTranslation('pci-ai-notebooks/notebooks/notebook');
  const { projectId } = useParams();
  const { isUserActive } = useUserActivityContext();
  const { data: backups } = useGetBackups(projectId, notebook.id, {
    refetchInterval: isUserActive && POLLING.BACKUPS,
  });

  const containers: ai.volume.Volume[] = notebook.spec.volumes?.filter(
    (vol: ai.volume.Volume) =>
      vol.volumeSource.dataStore &&
      vol.volumeSource.dataStore.internal === false,
  );

  const publicGitRepo: ai.volume.Volume[] = notebook.spec.volumes?.filter(
    (vol: ai.volume.Volume) => vol.volumeSource.publicGit,
  );

  const tabs = [
    { href: '', label: t('dashboardTab'), end: true },
    {
      href: 'containers',
      label: t('containerTab'),
      count: containers.length,
    },
    {
      href: 'public-git',
      label: t('publicGit'),
      count: publicGitRepo.length,
    },
    backups &&
      backups?.length > 0 && {
        href: 'backups',
        label: t('backupTab'),
        count: backups?.length,
      },
    { href: 'logs', label: t('logsTab') },
  ].filter((tab) => tab);
  return <TabsMenu tabs={tabs} />;
};

export default NotebookTabs;
