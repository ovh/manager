import { useNavigate, useParams } from 'react-router-dom';
import DeleteStorage from '../_components/DeleteStorage.component';
import { ObjectStorageTypeEnum } from '@/types/Storages';
import { useGetSwift } from '@/data/hooks/swift-storage/useGetSwift.hook';
import { useGetS3 } from '@/data/hooks/s3-storage/useGetS3.hook';

const DeleteContainerModal = () => {
  const { projectId, storageType, storageId, region } = useParams<{
    projectId: string;
    storageType: ObjectStorageTypeEnum;
    storageId: string;
    region: string;
  }>();
  const navigate = useNavigate();
  const s3Query = useGetS3({
    projectId,
    region,
    name: storageId,
    options: { enabled: storageType === ObjectStorageTypeEnum.s3 },
  });
  const swiftQuery = useGetSwift({
    projectId,
    containerId: storageId,
    noObjects: true,
    options: { enabled: storageType === ObjectStorageTypeEnum.swift },
  });
  const storageQuery =
    storageType === ObjectStorageTypeEnum.s3 ? s3Query : swiftQuery;

  return (
    <DeleteStorage
      onSuccess={() => navigate('../')}
      type={storageType}
      storage={storageQuery.data}
      storageId={storageId}
    />
  );
};

export default DeleteContainerModal;
