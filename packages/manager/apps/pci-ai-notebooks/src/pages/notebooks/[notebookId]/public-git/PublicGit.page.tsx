import { useNotebookData } from '../Notebook.context';
import * as ai from '@/types/cloud/project/ai';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import PublicGit from '@/components/public-git/PublicGit.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="components/public-git"
    />
  );
}

const PublicGitJob = () => {
  const { notebook } = useNotebookData();
  return (
    <PublicGit
      gitVolumes={notebook.spec.volumes.filter(
        (vol: ai.volume.Volume) => vol.volumeSource.publicGit,
      )}
    />
  );
};

export default PublicGitJob;
