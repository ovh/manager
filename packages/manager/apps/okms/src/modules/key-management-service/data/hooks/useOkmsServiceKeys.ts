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
} from '@/modules/key-management-service/data/api/okmsServiceKey';

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

export const useOkmsServiceKeys = ({ okmsId }: OkmsServiceKeyOptions) => {
  return useAllOkmsServiceKeys(okmsId);
};

/* Service Key */

type UseOkmsServiceKeyByIdParams = {
  okmsId: string;
  keyId: string;
  format?: 'JWK' | 'PEM';
  enabled?: boolean;
};

export const useOkmsServiceKeyById = ({
  okmsId,
  keyId,
  format,
  enabled = true,
}: UseOkmsServiceKeyByIdParams) => {
  return useQuery<OkmsServiceKeyWithData, ErrorResponse>({
    queryKey: getOkmsServiceKeyResourceQueryKey({ okmsId, keyId, format }),
    queryFn: () => getOkmsServiceKeyResource({ okmsId, keyId, format }),
    retry: false,
    ...{
      keepPreviousData: true,
    },
    enabled,
  });
};
