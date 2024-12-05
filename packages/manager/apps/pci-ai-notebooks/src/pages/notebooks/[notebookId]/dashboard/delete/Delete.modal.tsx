import { useNavigate, useParams } from 'react-router-dom';
import { useGetNotebook } from '@/hooks/api/ai/notebook/useGetNotebook.hook';
import DeleteNotebook from '../../_components/DeleteNotebook.component';

const DeleteNotebookModal = () => {
  const { projectId, notebookId } = useParams();
  const navigate = useNavigate();
  const notebookQuery = useGetNotebook(projectId, notebookId);
  return (
    <DeleteNotebook
      onSuccess={() => navigate('../..')}
      notebook={notebookQuery.data}
    />
  );
};

export default DeleteNotebookModal;
