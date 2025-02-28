import { useNavigate } from 'react-router-dom';
import * as ai from '@/types/cloud/project/ai';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useAppData } from '../App.context';
import Containers from '@/components/containers/Containers.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="components/containers"
    />
  );
}

const ContainersApp = () => {
  const { app } = useAppData();
  const navigate = useNavigate();
  return (
    <Containers
      volumes={app.spec.volumes.filter(
        (vol: ai.volume.Volume) => vol.volumeSource.dataStore,
      )}
      status={app.status.state}
      onDataSync={(volume) => {
        const volumeId = app.status.volumes.find(
          (vol) => vol.mountPath === volume.mountPath,
        ).id;
        navigate(`./data-sync/${volumeId}`);
      }}
    />
  );
};

export default ContainersApp;
