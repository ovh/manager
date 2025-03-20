import { useNavigate } from 'react-router-dom';
import ai from '@/types/AI';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useJobData } from '../Job.context';
import Containers from '@/components/containers/Containers.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="components/containers"
    />
  );
}

const ContainersJob = () => {
  const { job } = useJobData();
  const navigate = useNavigate();
  return (
    <Containers
      volumes={job.spec.volumes.filter(
        (vol: ai.volume.Volume) => vol.volumeSource.dataStore,
      )}
      updateMode={false}
      status={job.status.state}
      onDataSync={(volume) => {
        const volumeId = job.status.volumes.find(
          (vol) => vol.mountPath === volume.mountPath,
        ).id;
        navigate(`./data-sync/${volumeId}`);
      }}
    />
  );
};

export default ContainersJob;
