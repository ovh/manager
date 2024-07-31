import { useQuery } from '@tanstack/react-query';

import { ErrorResponse } from '@/types/api.type';
import {
  getOkmsServiceKeyResource,
  getOkmsServiceKeyResourceQueryKey,
  getOkmsServiceKeyResourceListQueryKey,
  getListingOkmsServiceKey,
  sortOkmsServiceKey,
} from '../api/okmsServiceKey';
import {
  OkmsAllServiceKeys,
  OkmsServiceKeyOptions,
} from '@/types/okmsServiceKey.type';

/* Service Key List */

export const useAllOkmsServiceKeys = (okmsId: string) => {
  return useQuery({
    queryKey: getOkmsServiceKeyResourceListQueryKey(okmsId),
    queryFn: () => getListingOkmsServiceKey(okmsId),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};

export const useOkmsServiceKeys = ({
  sorting,
  okmsId,
}: OkmsServiceKeyOptions) => {
  const {
    data: okms,
    error: allOKMSError,
    isLoading: allOKMSLoading,
  } = useAllOkmsServiceKeys(okmsId);

  return {
    isLoading: allOKMSLoading,
    error: allOKMSError,
    data: sortOkmsServiceKey(okms?.data || [], sorting),
  };
};

/* Service Key */

export const useOkmsServiceKeyById = ({
  okmsId,
  keyId,
}: {
  okmsId: string;
  keyId: string;
}) => {
  return useQuery<{ data: OkmsAllServiceKeys }, ErrorResponse>({
    queryKey: getOkmsServiceKeyResourceQueryKey({ okmsId, keyId }),
    queryFn: () => getOkmsServiceKeyResource({ okmsId, keyId }),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};
