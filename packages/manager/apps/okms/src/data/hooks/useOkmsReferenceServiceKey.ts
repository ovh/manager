import { useQuery } from '@tanstack/react-query';
import {
  getOkmsServiceKeyReferenceQueryKey,
  getServiceKeyReference,
} from '../api/okmsReference';
import OkmsServiceKeyReference from '@/types/okmsServiceKeyReference.type';
import { ErrorResponse } from '@/types/api.type';

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
