import { useNavigate, useParams } from 'react-router-dom';
import { useGetService } from '@/data/hooks/database/service/useGetService.hook';
import DeleteService from '../../_components/DeleteService.component';

const Delete = () => {
  const { projectId, serviceId } = useParams();
  const navigate = useNavigate();
  const serviceQuery = useGetService(projectId, serviceId);
  return (
    <DeleteService
      onSuccess={() => navigate('../../../')}
      service={serviceQuery.data}
    />
  );
};

export default Delete;
