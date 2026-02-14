import { Skeleton } from '@datatr-ux/uxlib';
import { useServiceData } from '../../Service.context';
import { useGetReplications } from '@/data/hooks/database/replication/useGetReplications.hook';
import AddEditReplication from '../_components/AddEditReplication.component';

const AddReplication = () => {
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

  if (!replicationsQuery.data) return <Skeleton className="w-full h-4" />;
  return <AddEditReplication replications={replications} service={service} />;
};

export default AddReplication;
