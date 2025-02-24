import { useNavigate, useParams } from 'react-router-dom';
import { useGetApp } from '@/hooks/api/ai/app/useGetApp.hook';
import DeleteApp from '../[appId]/_components/DeleteApp.component';

const DeleteAppModal = () => {
  const { projectId, appId } = useParams();
  const navigate = useNavigate();
  const appQuery = useGetApp(projectId, appId);
  return <DeleteApp onSuccess={() => navigate('../')} app={appQuery.data} />;
};

export default DeleteAppModal;
