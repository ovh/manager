import { useNavigate, useParams } from 'react-router-dom';
import StartNotebook from '../[notebookId]/_components/StartNotebook.component';
import { useGetNotebook } from '@/data/hooks/ai/notebook/useGetNotebook.hook';

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
