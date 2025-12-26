import { useNavigate, useParams } from 'react-router-dom';
import { useGetNotebook } from '@/data/hooks/ai/notebook/useGetNotebook.hook';
import RestartNotebook from '../[notebookId]/_components/RestartNotebook.component';

const RestartNotebookModal = () => {
  const { projectId, notebookId } = useParams();
  const navigate = useNavigate();
  const notebookQuery = useGetNotebook(projectId, notebookId);
  return (
    <RestartNotebook
      onSuccess={() => navigate('../')}
      notebook={notebookQuery.data}
    />
  );
};

export default RestartNotebookModal;
