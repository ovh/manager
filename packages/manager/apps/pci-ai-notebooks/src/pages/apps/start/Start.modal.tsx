import { useNavigate, useParams } from 'react-router-dom';
import { useGetApp } from '@/hooks/api/ai/app/useGetApp.hook';
import StartApp from '../[appId]/_components/StartApp.component';

const StartAppModal = () => {
  const { projectId, appId } = useParams();
  const navigate = useNavigate();
  const appQuery = useGetApp(projectId, appId);
  return <StartApp onSuccess={() => navigate('../')} app={appQuery.data} />;
};

export default StartAppModal;
