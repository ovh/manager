import { useQuery } from '@tanstack/react-query';
import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';
import { OKMS } from '@/types/okms.type';
import { ErrorResponse } from '@/types/api.type';
import {
  getOkmsResource,
  getOkmsResourceQueryKey,
  getOkmsServicesResourceListQueryKey,
} from '@/data/api/okms';

export const useOkmsById = (okmsId: string) => {
  return useQuery<{ data: OKMS }, ErrorResponse>({
    queryKey: getOkmsResourceQueryKey(okmsId),
    queryFn: () => getOkmsResource(okmsId),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};

type UseOkmsListParams = {
  pageSize?: number;
};

export const useOkmsList = (params: UseOkmsListParams = {}) => {
  const { pageSize = 100 } = params;

  return useResourcesIcebergV2<OKMS>({
    route: '/okms/resource',
    queryKey: getOkmsServicesResourceListQueryKey,
    pageSize,
  });
};
