import { useQuery } from '@tanstack/react-query';
import OkmsServiceKeyReference from '@key-management-service/types/okmsServiceKeyReference.type';
import {
  getOkmsServiceKeyReferenceQueryKey,
  getServiceKeyReference,
} from '../api/okmsReference';
import { ErrorResponse } from '@/common/types/api.type';

export const useOkmsServiceKeyReference = (okmsRegion: string) => {
  return useQuery<{ data: OkmsServiceKeyReference[] }, ErrorResponse>({
    queryKey: getOkmsServiceKeyReferenceQueryKey(okmsRegion),
    queryFn: () => getServiceKeyReference(okmsRegion),
    enabled: okmsRegion.length > 0,
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};
