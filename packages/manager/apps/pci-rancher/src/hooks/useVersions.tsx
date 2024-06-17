import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import {
  getRancherVersion,
  getpublicCloudReferenceRancherVersionListQueryKey,
} from '../api/apiv2/services';

const useVersions = () => {
  const { projectId } = useParams();
  return useQuery({
    queryKey: getpublicCloudReferenceRancherVersionListQueryKey,
    queryFn: () => getRancherVersion(projectId),
  });
};

export default useVersions;
