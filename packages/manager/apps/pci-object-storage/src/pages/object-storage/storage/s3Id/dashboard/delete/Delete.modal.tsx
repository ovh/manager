import { useNavigate } from 'react-router-dom';
import DeleteS3 from '../../../_components/DeleteS3.component';
import { useS3Data } from '../../S3.context';

const DeleteS3Modal = () => {
  const { s3 } = useS3Data();
  const navigate = useNavigate();

  return <DeleteS3 onSuccess={() => navigate('../../')} s3={s3} />;
};

export default DeleteS3Modal;
