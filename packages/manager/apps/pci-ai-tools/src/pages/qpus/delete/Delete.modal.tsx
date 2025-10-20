import { useNavigate, useParams } from 'react-router-dom';
import { useGetNotebook } from '@/data/hooks/ai/notebook/useGetNotebook.hook';
import DeleteNotebook from '@/pages/notebooks/[notebookId]/_components/DeleteNotebook.component';

const DeleteNotebookModal = () => {
  const { projectId, notebookId } = useParams();
  const navigate = useNavigate();
  const notebookQuery = useGetNotebook(projectId, notebookId);
  return (
    <DeleteNotebook
      onSuccess={() => navigate('../')}
      notebook={notebookQuery.data}
    />
  );
};

export default DeleteNotebookModal;
