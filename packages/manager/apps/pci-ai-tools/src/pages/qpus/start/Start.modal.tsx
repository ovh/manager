import { useNavigate, useParams } from 'react-router-dom';
import { useGetNotebook } from '@/data/hooks/ai/notebook/useGetNotebook.hook';
import StartNotebook from '@/pages/notebooks/[notebookId]/_components/StartNotebook.component';

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
