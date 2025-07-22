import { useNavigate } from 'react-router-dom';
import { useNotebookData } from '../Notebook.context';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import PublicGit from '@/components/public-git/PublicGit.component';
import ai from '@/types/AI';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="ai-tools/components/public-git"
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
      status={notebook.status.state}
      updateMode={true}
      disabled={notebook.status.state !== ai.notebook.NotebookStateEnum.STOPPED}
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
