import { Outlet, useParams } from 'react-router-dom';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { POLLING } from '@/configuration/polling.constants';
import { useGetUsers } from '@/data/hooks/user/useGetUsers.hook';
import UsersList from './_components/UserListTable.component';
import { useGetUsersWithS3Credentials } from '@/data/hooks/user/useGetUsersWithS3Credentials.hook';

const Users = () => {
  const { projectId } = useParams();
  const { isUserActive } = useUserActivityContext();

  const usersQuery = useGetUsers(projectId, {
    refetchInterval: isUserActive && POLLING.USERS,
  });


  if (usersQuery.isLoading) return <UsersList.Skeleton />;
  return (
    <>
      <UsersList users={usersQuery.data || []} />
      <Outlet />
    </>
  );
};

export default Users;
