import { useNavigate, useParams } from 'react-router-dom';
import DeleteApp from '../[appId]/_components/DeleteApp.component';
import { useGetApp } from '@/data/hooks/ai/app/useGetApp.hook';

const DeleteAppModal = () => {
  const { projectId, appId } = useParams();
  const navigate = useNavigate();
  const appQuery = useGetApp(projectId, appId);
  return <DeleteApp onSuccess={() => navigate('../')} app={appQuery.data} />;
};

export default DeleteAppModal;
