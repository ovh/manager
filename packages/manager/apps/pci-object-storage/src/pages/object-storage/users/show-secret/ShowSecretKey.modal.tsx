import { useNavigate, useParams } from 'react-router-dom';
import RouteModal from '@/components/route-modal/RouteModal';
import { useObjectStorageData } from '../../ObjectStorage.context';
import UserSecretKey from './UserSecretKey.component';

const UserSecret = () => {
  const { userId } = useParams();
  const { users } = useObjectStorageData();
  const navigate = useNavigate();
  const currentUser = users.find((us) => us.id === Number(userId));
  if (!currentUser) navigate('../');

  return (
    <RouteModal isLoading={!currentUser}>
      <UserSecretKey user={currentUser} />
    </RouteModal>
  );
};

export default UserSecret;
