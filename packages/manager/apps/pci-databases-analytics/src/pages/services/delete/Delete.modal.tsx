import { useNavigate, useParams } from 'react-router-dom';
import { useGetService } from '@/hooks/api/database/service/useGetService.hook';
import DeleteService from '../[serviceId]/_components/DeleteService.component';

const DeleteServiceModal = () => {
  const { projectId, serviceId } = useParams();
  const navigate = useNavigate();
  const serviceQuery = useGetService(projectId, serviceId);
  return (
    <DeleteService
      onSuccess={() => navigate('../')}
      service={serviceQuery.data}
    />
  );
};

export default DeleteServiceModal;
