import { useNavigate, useParams } from 'react-router-dom';
import StartApp from '../[appId]/_components/StartApp.component';
import { useGetApp } from '@/data/hooks/ai/app/useGetApp.hook';

const StartAppModal = () => {
  const { projectId, appId } = useParams();
  const navigate = useNavigate();
  const appQuery = useGetApp(projectId, appId);
  return <StartApp onSuccess={() => navigate('../')} app={appQuery.data} />;
};

export default StartAppModal;
