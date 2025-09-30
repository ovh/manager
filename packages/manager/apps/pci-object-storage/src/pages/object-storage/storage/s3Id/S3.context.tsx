import { UseQueryResult } from '@tanstack/react-query';
import { StorageContainer } from '@datatr-ux/ovhcloud-types/cloud/index';
import { useParams } from 'react-router-dom';
import { useGetS3 } from '@/data/hooks/s3-storage/useGetS3.hook';

// Share data with the child routes
export type S3LayoutContext = {
  s3: StorageContainer;
  s3Query: UseQueryResult<StorageContainer, Error>;
};
export const useS3Data = () => {
  const { projectId, region, s3Name } = useParams();
  const s3Query = useGetS3({ projectId, region, name: s3Name });
  return { projectId, s3: s3Query.data, s3Query };
};
