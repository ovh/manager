import { useServiceData } from '../../Service.context';
import { useGetUsers } from '@/hooks/api/database/user/useGetUsers.hook';
import AddEditUserModal from '../_components/AddEditUser.component';
import { Skeleton } from '@/components/ui/skeleton';

const AddUserModal = () => {
  const { projectId, service } = useServiceData();
  const usersQuery = useGetUsers(projectId, service.engine, service.id, {
    enabled: !!service.id,
  });
  const users = usersQuery.data;

  if (!users) return <Skeleton className="w-full h-4" />;
  return <AddEditUserModal existingUsers={usersQuery.data} service={service} />;
};

export default AddUserModal;
