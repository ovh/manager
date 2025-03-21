import ai from '@/types/AI';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useAppData } from '../App.context';
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
  const { app } = useAppData();
  return (
    <PublicGit
      gitVolumes={app.spec.volumes.filter(
        (vol: ai.volume.Volume) => vol.volumeSource.publicGit,
      )}
      updateMode={false}
    />
  );
};

export default PublicGitNotebook;
