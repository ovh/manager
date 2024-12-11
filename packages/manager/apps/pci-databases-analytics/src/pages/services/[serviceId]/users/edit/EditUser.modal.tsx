import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useServiceData } from '../../Service.context';
import { useGetUsers } from '@/hooks/api/database/user/useGetUsers.hook';
import AddEditUserModal from '../_components/AddEditUser.component';

const AddUserModal = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { projectId, service } = useServiceData();
  const usersQuery = useGetUsers(projectId, service.engine, service.id, {
    enabled: !!service.id,
  });
  const users = usersQuery.data;
  const editedUser = users?.find((u) => u.id === userId);

  useEffect(() => {
    if (users && !editedUser) navigate('../');
  }, [users, editedUser]);

  return (
    <AddEditUserModal
      existingUsers={users}
      service={service}
      editedUser={editedUser}
    />
  );
};

export default AddUserModal;
