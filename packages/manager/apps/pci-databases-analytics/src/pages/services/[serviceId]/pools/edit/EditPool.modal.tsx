import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Skeleton } from '@datatr-ux/uxlib';
import { useServiceData } from '../../Service.context';
import AddEditPool from '../_components/AddEditPool.component';
import { useGetConnectionPools } from '@/hooks/api/database/connectionPool/useGetConnectionPools.hook';
import { useGetDatabases } from '@/hooks/api/database/database/useGetDatabases.hook';
import { useGetUsers } from '@/hooks/api/database/user/useGetUsers.hook';

const EditPoolModal = () => {
  const { poolId } = useParams();
  const navigate = useNavigate();
  const { projectId, service } = useServiceData();
  const usersQuery = useGetUsers(projectId, service.engine, service.id, {
    enabled: !!service.id,
  });
  const databasesQuery = useGetDatabases(
    projectId,
    service.engine,
    service.id,
    {
      enabled: !!service.id,
    },
  );
  const connectionPoolsQuery = useGetConnectionPools(
    projectId,
    service.engine,
    service.id,
    {
      enabled: !!service.id,
    },
  );
  const users = usersQuery.data;
  const databases = databasesQuery.data;
  const connectionPools = connectionPoolsQuery.data;
  const editedConnectionPools = connectionPools?.find((c) => c.id === poolId);

  useEffect(() => {
    if (connectionPools && !editedConnectionPools) navigate('../');
  }, [connectionPools, editedConnectionPools]);

  if (!users || !databases || !connectionPools)
    return <Skeleton className="w-full h-4" />;
  return (
    <AddEditPool
      service={service}
      connectionPools={connectionPools}
      databases={databases}
      users={users}
      editedConnectionPool={editedConnectionPools}
    />
  );
};

export default EditPoolModal;
