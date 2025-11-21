import { useNavigate, useParams } from 'react-router-dom';
import { useGetNotebook } from '@/data/hooks/ai/notebook/useGetNotebook.hook';
import ReStartNotebook from '../[notebookId]/_components/ReStartNotebook.component';

const ReStartNotebookModal = () => {
  const { projectId, notebookId } = useParams();
  const navigate = useNavigate();
  const notebookQuery = useGetNotebook(projectId, notebookId);
  return (
    <ReStartNotebook
      onSuccess={() => navigate('../')}
      notebook={notebookQuery.data}
    />
  );
};

export default ReStartNotebookModal;
