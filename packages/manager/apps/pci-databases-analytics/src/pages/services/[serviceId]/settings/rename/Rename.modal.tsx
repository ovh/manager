import { useNavigate, useParams } from 'react-router-dom';
import { useGetService } from '@/data/hooks/database/service/useGetService.hook';
import RenameService from '../../_components/RenameService.component';

const Rename = () => {
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

export default Rename;
