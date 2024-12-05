import { useNavigate, useParams } from 'react-router-dom';
import { useGetNotebook } from '@/hooks/api/ai/notebook/useGetNotebook.hook';
import StartNotebook from '../[notebookId]/_components/StartNotebook.component';

const StartNotebookModal = () => {
  const { projectId, notebookId } = useParams();
  const navigate = useNavigate();
  const notebookQuery = useGetNotebook(projectId, notebookId);
  return (
    <StartNotebook
      onSuccess={() => navigate('../')}
      notebook={notebookQuery.data}
    />
  );
};

export default StartNotebookModal;
