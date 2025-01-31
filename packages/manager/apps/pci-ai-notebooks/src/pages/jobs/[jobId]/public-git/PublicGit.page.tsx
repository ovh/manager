import { useTranslation } from 'react-i18next';
import * as ai from '@/types/cloud/project/ai';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import GitList from './_components/GitListTable.component';
import { useJobData } from '../Job.context';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-ai-training/jobs/job/public-git"
    />
  );
}

const PublicGit = () => {
  const { job } = useJobData();
  const { t } = useTranslation('pci-ai-training/jobs/job/public-git');
  return (
    <>
      <h2>{t('publicGitTitle')}</h2>
      <p>{t('publicGitDescription')}</p>
      <GitList
        git={job.spec.volumes.filter(
          (vol: ai.volume.Volume) => vol.volumeSource.publicGit,
        )}
      />
    </>
  );
};

export default PublicGit;
