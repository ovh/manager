import { useNavigate, useParams } from 'react-router-dom';
import { useGetService } from '@/data/hooks/database/service/useGetService.hook';
import DeleteServiceComponent from '../[serviceId]/_components/DeleteService.component';

const DeleteService = () => {
  const { projectId, serviceId } = useParams();
  const navigate = useNavigate();
  const serviceQuery = useGetService(projectId, serviceId);

  return (
    <DeleteServiceComponent
      onSuccess={() => navigate('../')}
      service={serviceQuery.data}
    />
  );
};

export default DeleteService;
