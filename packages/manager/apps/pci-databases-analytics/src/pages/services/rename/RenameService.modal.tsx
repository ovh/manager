import { useNavigate, useParams } from 'react-router-dom';
import { useGetService } from '@/data/hooks/database/service/useGetService.hook';
import RenameServiceComponent from '../[serviceId]/_components/RenameService.component';

const RenameService = () => {
  const { projectId, serviceId } = useParams();
  const navigate = useNavigate();
  const serviceQuery = useGetService(projectId, serviceId);

  return (
    <RenameServiceComponent
      onSuccess={() => navigate('../')}
      service={serviceQuery.data}
    />
  );
};

export default RenameService;
