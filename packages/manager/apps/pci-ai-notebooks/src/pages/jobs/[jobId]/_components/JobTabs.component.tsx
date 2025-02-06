import { useTranslation } from 'react-i18next';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';
import * as ai from '@/types/cloud/project/ai';

interface JobTabsProps {
  job: ai.job.Job;
}

const JobTabs = ({ job }: JobTabsProps) => {
  const { t } = useTranslation('pci-ai-training/jobs/job');

  const containers: ai.volume.Volume[] = job.spec.volumes?.filter(
    (vol: ai.volume.Volume) =>
      vol.volumeSource.dataStore &&
      vol.volumeSource.dataStore.internal === false,
  );

  const publicGitRepo: ai.volume.Volume[] = job.spec.volumes?.filter(
    (vol: ai.volume.Volume) => vol.volumeSource.publicGit,
  );

  const tabs = [
    { href: '', label: t('dashboardTab'), end: true },
    containers?.length > 0 && {
      href: 'containers',
      label: t('containerTab'),
      count: containers?.length,
    },
    publicGitRepo?.length > 0 && {
      href: 'public-git',
      label: t('publicGit'),
      count: publicGitRepo?.length,
    },
    { href: 'logs', label: t('logsTab') },
  ].filter((tab) => tab);
  return <TabsMenu tabs={tabs} />;
};

export default JobTabs;
