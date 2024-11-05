import { OsdsProgressBar } from '@ovhcloud/ods-components/react';
import { useParams } from 'react-router-dom';
import { useGetClusterEtcdUsage } from '@/api/hooks/useKubernetes';
import { formatBytes } from '@/helpers';

// TODO rajouter le seuil

function ClusterEtcd() {
  const { projectId, kubeId } = useParams();
  const {
    data: { usage: used, quota: total },
  } = useGetClusterEtcdUsage(projectId, kubeId);
  const percentage = (used / total) * 100;
  return (
    <div className="w-full p-3 my-4">
      <OsdsProgressBar color="error" value={percentage} max={100} />
      <div style={{ textAlign: 'right', marginTop: '4px' }}>
        {formatBytes(used)} / {formatBytes(total)}
      </div>
    </div>
  );
}

export default ClusterEtcd;
