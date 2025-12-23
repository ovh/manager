import {
  OkmsServiceKey,
  OkmsServiceKeyOptions,
  OkmsServiceKeyWithData,
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
  return useQuery<OkmsServiceKey[], ApiError>({
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
    data: sortOkmsServiceKey(okms || [], sorting),
  };
};

/* Service Key */

type UseOkmsServiceKeyByIdParams = {
  okmsId: string;
  keyId: string;
  enabled?: boolean;
};

export const useOkmsServiceKeyById = ({
  okmsId,
  keyId,
  enabled = true,
}: UseOkmsServiceKeyByIdParams) => {
  return useQuery<OkmsServiceKeyWithData, ErrorResponse>({
    queryKey: getOkmsServiceKeyResourceQueryKey({ okmsId, keyId }),
    queryFn: () => getOkmsServiceKeyResource({ okmsId, keyId }),
    retry: false,
    ...{
      keepPreviousData: true,
    },
    enabled,
  });
};
