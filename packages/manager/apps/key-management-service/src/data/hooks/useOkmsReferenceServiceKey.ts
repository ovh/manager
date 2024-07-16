import { useQuery } from '@tanstack/react-query';
import {
  getOkmsServiceKeyReferenceQueryKey,
  getServiceKeyReference,
} from '../api/okmsReference';

export const useOkmsServiceKeyReference = (okmsRegion: string) => {
  return useQuery({
    queryKey: getOkmsServiceKeyReferenceQueryKey(okmsRegion),
    queryFn: () => getServiceKeyReference(okmsRegion),
    enabled: false,
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};
