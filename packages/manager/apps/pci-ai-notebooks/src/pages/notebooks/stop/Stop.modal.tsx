import { useNavigate, useParams } from 'react-router-dom';
import { useGetNotebook } from '@/hooks/api/ai/notebook/useGetNotebook.hook';
import StopNotebook from '../[notebookId]/_components/StopNotebook.component';

const StopNotebookModal = () => {
  const { projectId, notebookId } = useParams();
  const navigate = useNavigate();
  const notebookQuery = useGetNotebook(projectId, notebookId);
  return (
    <StopNotebook
      onSuccess={() => navigate('../')}
      notebook={notebookQuery.data}
    />
  );
};

export default StopNotebookModal;
