import {
  OkmsServiceKey,
  OkmsServiceKeyOptions,
} from '@key-management-service/types/okmsServiceKey.type';
import { useQuery } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import { ErrorResponse } from '@/common/types/api.type';

import {
  getListingOkmsServiceKey,
  getOkmsServiceKeyResource,
  getOkmsServiceKeyResourceListQueryKey,
  getOkmsServiceKeyResourceQueryKey,
  sortOkmsServiceKey,
} from '../api/okmsServiceKey';

/* Service Key List */

export const useAllOkmsServiceKeys = (okmsId: string) => {
  return useQuery<{ data: OkmsServiceKey[] }, ApiError>({
    queryKey: getOkmsServiceKeyResourceListQueryKey(okmsId),
    queryFn: () => getListingOkmsServiceKey(okmsId),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};

export const useOkmsServiceKeys = ({ sorting, okmsId }: OkmsServiceKeyOptions) => {
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

export const useOkmsServiceKeyById = ({ okmsId, keyId }: { okmsId: string; keyId: string }) => {
  return useQuery<{ data: OkmsServiceKey }, ErrorResponse>({
    queryKey: getOkmsServiceKeyResourceQueryKey({ okmsId, keyId }),
    queryFn: () => getOkmsServiceKeyResource({ okmsId, keyId }),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};
