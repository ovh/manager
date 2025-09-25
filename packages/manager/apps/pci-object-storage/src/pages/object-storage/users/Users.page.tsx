import { Outlet, useParams } from 'react-router-dom';
import * as role from '@datatr-ux/ovhcloud-types/cloud/role/index';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { POLLING } from '@/configuration/polling.constants';
import { useGetUsers } from '@/data/hooks/user/useGetUsers.hook';
import UsersList from './_components/UserListTable.component';
import user from '@/types/User';
import { useGetUsersWithS3Credentials } from '@/data/hooks/user/useGetUsersWithS3Credentials.hook';
import { useGetRegions } from '@/data/hooks/region/useGetRegions.hook';

const Users = () => {
  const { projectId } = useParams();
  const { isUserActive } = useUserActivityContext();

  const usersQuery = useGetUsers(projectId, {
    refetchInterval: isUserActive && POLLING.USERS,
  });

  const regionQuery = useGetRegions(projectId);

  const s3UserQueries = useGetUsersWithS3Credentials(
    projectId,
    usersQuery.data,
  );

  console.log(regionQuery.data);
  if (usersQuery.isLoading) return <UsersList.Skeleton />;
  return (
    <>
      <UsersList users={s3UserQueries.data || []} />
      <Outlet />
    </>
  );
};

export default Users;
