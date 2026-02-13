import { useNavigate, useParams } from 'react-router-dom';
import DeleteS3 from '../../../../../_components/storages/DeleteS3.component';
import { useS3Data } from '../../S3.context';

const DeleteS3Modal = () => {
  const { projectId } = useParams();
  const { s3 } = useS3Data();
  const navigate = useNavigate();

  return (
    <DeleteS3
      onSuccess={() => navigate(`/pci/projects/${projectId}/storages/objects`)}
      s3={s3}
    />
  );
};

export default DeleteS3Modal;
