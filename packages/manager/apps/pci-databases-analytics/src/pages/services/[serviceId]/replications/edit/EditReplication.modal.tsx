import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Skeleton } from '@datatr-ux/uxlib';
import { useServiceData } from '../../Service.context';
import { useGetReplications } from '@/hooks/api/database/replication/useGetReplications.hook';
import AddEditReplication from '../_components/AddEditReplication.component';

const EditReplicationModal = () => {
  const { replicationId } = useParams();
  const navigate = useNavigate();
  const { projectId, service } = useServiceData();
  const replicationsQuery = useGetReplications(
    projectId,
    service.engine,
    service.id,
    {
      enabled: !!service.id,
    },
  );
  const replications = replicationsQuery.data;
  const editedReplication = replications?.find((n) => n.id === replicationId);

  useEffect(() => {
    if (replications && !editedReplication) navigate('../');
  }, [replications, editedReplication]);

  if (!replicationsQuery.data) return <Skeleton className="w-full h-4" />;
  return (
    <AddEditReplication
      replications={replications}
      service={service}
      editedReplication={editedReplication}
    />
  );
};

export default EditReplicationModal;
