import { useNavigate, useParams } from 'react-router-dom';
import StopApp from '../[appId]/_components/StopApp.component';
import { useGetApp } from '@/data/hooks/ai/app/useGetApp.hook';

const StopAppModal = () => {
  const { projectId, appId } = useParams();
  const navigate = useNavigate();
  const appQuery = useGetApp(projectId, appId);
  return <StopApp onSuccess={() => navigate('../')} app={appQuery.data} />;
};

export default StopAppModal;
