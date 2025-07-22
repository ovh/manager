import { useNavigate, useParams } from 'react-router-dom';
import StopNotebook from '../[notebookId]/_components/StopNotebook.component';
import { useGetNotebook } from '@/data/hooks/ai/notebook/useGetNotebook.hook';

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
