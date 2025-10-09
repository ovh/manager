import { useNavigate, useParams } from 'react-router-dom';
import RouteModal from '@/components/route-modal/RouteModal';
import { useObjectStorageData } from '../../ObjectStorage.context';
import UserSecretKey from './UserSecretKey.component';
import { useGetUserS3Credentials } from '@/data/hooks/user/useGetUserS3Credentials.hook';

const UserSecret = () => {
  const { projectId, userId } = useParams();
  const { users } = useObjectStorageData();
  const navigate = useNavigate();
  const currentUser = users.find((us) => us.id === Number(userId));
  const credsQuery = useGetUserS3Credentials(projectId, currentUser.id, {
    enabled: !!currentUser.id,
  });
  if (!currentUser) navigate('../');

  return (
    <RouteModal isLoading={!currentUser || credsQuery.isPending}>
      <UserSecretKey
        user={{
          ...currentUser,
          access_key: credsQuery.data?.[0].access,
        }}
      />
    </RouteModal>
  );
};

export default UserSecret;
