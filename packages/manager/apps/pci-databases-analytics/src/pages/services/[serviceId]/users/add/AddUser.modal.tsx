import { useServiceData } from '../../Service.context';
import { useGetUsers } from '@/hooks/api/database/user/useGetUsers.hook';
import AddEditUserModal from '../_components/AddEditUser.component';

const AddUserModal = () => {
  const { projectId, service } = useServiceData();
  const usersQuery = useGetUsers(projectId, service.engine, service.id, {
    enabled: !!service.id,
  });
  return <AddEditUserModal existingUsers={usersQuery.data} service={service} />;
};

export default AddUserModal;
