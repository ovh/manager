import { useNavigate, useParams } from 'react-router-dom';
import DeleteNotebook from '../../_components/DeleteNotebook.component';
import { useGetNotebook } from '@/data/hooks/ai/notebook/useGetNotebook.hook';

const DeleteNotebookModal = () => {
  const { projectId, notebookId } = useParams();
  const navigate = useNavigate();
  const notebookQuery = useGetNotebook(projectId, notebookId);
  return (
    <DeleteNotebook
      onSuccess={() => navigate('../../notebooks')}
      notebook={notebookQuery.data}
    />
  );
};

export default DeleteNotebookModal;
