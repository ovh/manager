import { useNavigate, useParams } from 'react-router-dom';
import DeleteStorage from '../../../_components/DeleteStorage.component';
import { useSwiftData } from '../../Swift.context';
import { ObjectStorageTypeEnum } from '@/types/Storages';

const DeleteSwiftModal = () => {
  const { swiftId } = useParams();
  const { swift } = useSwiftData();
  const navigate = useNavigate();

  return (
    <DeleteStorage
      onSuccess={() => navigate('../../')}
      storage={swift}
      storageId={swiftId}
      type={ObjectStorageTypeEnum.swift}
    />
  );
};

export default DeleteSwiftModal;
