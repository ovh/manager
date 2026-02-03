import OkmsServiceKeyReference from '@key-management-service/types/okmsServiceKeyReference.type';
import { useQuery } from '@tanstack/react-query';

import { ErrorResponse } from '@/common/types/api.type';

import { getOkmsServiceKeyReferenceQueryKey, getServiceKeyReference } from '../api/okmsReference';

export const useOkmsServiceKeyReference = (okmsRegion: string) => {
  return useQuery<OkmsServiceKeyReference[], ErrorResponse>({
    queryKey: getOkmsServiceKeyReferenceQueryKey(okmsRegion),
    queryFn: () => getServiceKeyReference(okmsRegion),
    enabled: okmsRegion.length > 0,
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};
