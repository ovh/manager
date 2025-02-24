import * as ai from '@/types/cloud/project/ai';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useJobData } from '../Job.context';
import PublicGit from '@/components/public-git/PublicGit.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="components/public-git"
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
    />
  );
};

export default PublicGitNotebook;
