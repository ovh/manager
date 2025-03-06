import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  return (
    <PublicGit
      gitVolumes={notebook.spec.volumes.filter(
        (vol: ai.volume.Volume) => vol.volumeSource.publicGit,
      )}
      updateMode={true}
      onDelete={(volume) => {
        const volumeId = notebook.status.volumes.find(
          (vol) => vol.mountPath === volume.mountPath,
        ).id;
        navigate(`./delete/${volumeId}`);
      }}
    />
  );
};

export default PublicGitJob;
