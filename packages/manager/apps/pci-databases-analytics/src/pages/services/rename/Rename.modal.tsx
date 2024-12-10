import { useNavigate, useParams } from 'react-router-dom';
import { useGetService } from '@/hooks/api/database/service/useGetService.hook';
import RenameService from '../[serviceId]/_components/RenameService.component';

const RenameServiceModal = () => {
  const { projectId, serviceId } = useParams();
  const navigate = useNavigate();
  const serviceQuery = useGetService(projectId, serviceId);
  return (
    <RenameService
      onSuccess={() => navigate('../')}
      service={serviceQuery.data}
    />
  );
};

export default RenameServiceModal;
