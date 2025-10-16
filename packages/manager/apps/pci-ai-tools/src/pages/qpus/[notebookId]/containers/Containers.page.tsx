import { useNavigate } from 'react-router-dom';
import { useNotebookData } from '../Notebook.context';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import Containers from '@/components/containers/Containers.component';
import ai from '@/types/AI';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="ai-tools/components/containers"
    />
  );
}

const ContainersNotebook = () => {
  const { notebook } = useNotebookData();
  const navigate = useNavigate();

  return (
    <Containers
      volumes={notebook.spec.volumes.filter(
        (vol: ai.volume.Volume) =>
          vol.volumeSource.dataStore &&
          vol.volumeSource.dataStore?.internal === false,
      )}
      status={notebook.status.state}
      onDataSync={(volume) => {
        const volumeId = notebook.status.volumes.find(
          (vol) => vol.mountPath === volume.mountPath,
        ).id;
        navigate(`./data-sync/${volumeId}`);
      }}
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

export default ContainersNotebook;
