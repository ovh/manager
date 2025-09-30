import { useNavigate, useParams } from 'react-router-dom';
import DeleteStorage from '../_components/DeleteStorage.component';
import { ObjectStorageTypeEnum } from '@/types/Storages';
import { useGetSwift } from '@/data/hooks/swift-storage/useGetSwift.hook';
import { useGetS3 } from '@/data/hooks/s3-storage/useGetS3.hook';

const DeleteContainerModal = () => {
  const { projectId, storageType, storageId, region } = useParams();
  const navigate = useNavigate();
  const storageQuery =
    storageType === ObjectStorageTypeEnum.s3
      ? useGetS3({ projectId, region, name: storageId })
      : useGetSwift({ projectId, containerId: storageId, noObjects: true });

  return (
    <DeleteStorage
      onSuccess={() => navigate('../')}
      type={
        storageType === ObjectStorageTypeEnum.s3
          ? ObjectStorageTypeEnum.s3
          : ObjectStorageTypeEnum.swift
      }
      storage={storageQuery.data}
      storageId={storageId}
    />
  );
};

export default DeleteContainerModal;
