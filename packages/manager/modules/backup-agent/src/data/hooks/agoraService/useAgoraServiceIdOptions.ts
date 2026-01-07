import { queryOptions, useQueryClient } from '@tanstack/react-query';

import {
  getResourceServiceId,
  getResourceServiceIdQueryKey,
} from '@ovh-ux/manager-module-common-api';

export const getAgoraServiceIdOptions = (resourceName: string) =>
  queryOptions({
    queryKey: getResourceServiceIdQueryKey({ resourceName }),
    queryFn: () => getResourceServiceId({ resourceName }),
  });

export const useGetAgoraServiceIdOptions = () => {
  const queryClient = useQueryClient();

  return (resourceName: string) =>
    queryClient.ensureQueryData(getAgoraServiceIdOptions(resourceName));
};
