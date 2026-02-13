import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useGetStorages } from '@/data/hooks/storage/useGetStorages.hook';
import { useS3Data } from '../../../S3.context';
import { ObjectStorageTypeEnum } from '@/types/Storages';

export const useGetAvailableDestinationsContainers = () => {
  const { projectId } = useParams();
  const { s3 } = useS3Data();
  const storagesQuery = useGetStorages(projectId);
  const availableDestinations = useMemo(
    () =>
      storagesQuery.data?.resources.filter(
        (r) =>
          r.storageType === ObjectStorageTypeEnum.s3 &&
          !(r.region === s3?.region && r.name === s3?.name),
      ) ?? [],
    [storagesQuery.data],
  );
  return { availableDestinations, isLoading: storagesQuery.isLoading };
};
