import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Skeleton } from '@datatr-ux/uxlib';
import { useServiceData } from '../../Service.context';
import AddEditPool from '../_components/AddEditPool.component';
import { useGetConnectionPools } from '@/data/hooks/database/connectionPool/useGetConnectionPools.hook';
import { useGetDatabases } from '@/data/hooks/database/database/useGetDatabases.hook';
import { useGetUsers } from '@/data/hooks/database/user/useGetUsers.hook';

const EditPool = () => {
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

export default EditPool;
