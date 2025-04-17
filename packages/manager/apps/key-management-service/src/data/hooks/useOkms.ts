import { useQuery } from '@tanstack/react-query';
import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';
import { OKMS } from '@/types/okms.type';
import { ErrorResponse } from '@/types/api.type';
import {
  getOKMSResource,
  getOkmsResourceQueryKey,
  getOkmsServicesResourceListQueryKey,
} from '@/data/api/okms';

export const useOkmsById = (okmsId: string) => {
  return useQuery<{ data: OKMS }, ErrorResponse>({
    queryKey: getOkmsResourceQueryKey(okmsId),
    queryFn: () => getOKMSResource(okmsId),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};

export const useOkmsList = ({ pageSize }: { pageSize?: number }) =>
  useResourcesIcebergV2<OKMS>({
    route: '/okms/resource',
    queryKey: getOkmsServicesResourceListQueryKey,
    pageSize,
  });
