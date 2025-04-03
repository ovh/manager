import ai from '@/types/AI';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useJobData } from '../Job.context';
import PublicGit from '@/components/public-git/PublicGit.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="ai-tools/components/public-git"
    />
  );
}

const PublicGitNotebook = () => {
  const { job } = useJobData();
  return (
    <PublicGit
      gitVolumes={job.spec.volumes.filter(
        (vol: ai.volume.Volume) => vol.volumeSource.publicGit,
      )}
      updateMode={false}
    />
  );
};

export default PublicGitNotebook;
