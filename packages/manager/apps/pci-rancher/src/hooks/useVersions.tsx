import { useQuery } from '@tanstack/react-query';

import {
  getVersions,
  getpublicCloudReferenceRancherVersionListQueryKey,
} from '../api/apiv2/services';

const useVersions = () => {
  return useQuery({
    queryKey: getpublicCloudReferenceRancherVersionListQueryKey,
    queryFn: () => getVersions(),
  });
};

export default useVersions;
