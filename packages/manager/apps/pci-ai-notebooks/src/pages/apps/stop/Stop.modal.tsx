import { useNavigate, useParams } from 'react-router-dom';
import { useGetApp } from '@/hooks/api/ai/app/useGetApp.hook';
import StopApp from '../[appId]/_components/StopApp.component';

const StopAppModal = () => {
  const { projectId, appId } = useParams();
  const navigate = useNavigate();
  const appQuery = useGetApp(projectId, appId);
  return <StopApp onSuccess={() => navigate('../')} app={appQuery.data} />;
};

export default StopAppModal;
