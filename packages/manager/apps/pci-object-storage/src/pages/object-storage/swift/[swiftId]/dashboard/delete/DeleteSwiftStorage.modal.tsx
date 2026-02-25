import { useNavigate, useParams } from 'react-router-dom';
import DeleteStorage from '../../../../_components/storages/DeleteSwift.component';
import { useSwiftData } from '../../Swift.context';

const DeleteSwiftModal = () => {
  const { swiftId } = useParams();
  const { swift } = useSwiftData();
  const navigate = useNavigate();

  return (
    <DeleteStorage
      onSuccess={() => navigate('../../')}
      swift={swift}
      swiftId={swiftId}
    />
  );
};

export default DeleteSwiftModal;
