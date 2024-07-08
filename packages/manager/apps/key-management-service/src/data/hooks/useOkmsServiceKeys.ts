import { useQuery } from '@tanstack/react-query';
import apiClient from '@ovh-ux/manager-core-api';

import { ErrorResponse } from '@/types/api.type';
import {
  getOkmsServiceKeyResourceQueryKey,
  getOkmsServiceKeyResourceListQueryKey,
  getListingOkmsServiceKey,
  sortOkmsServiceKey,
} from '../api/okmsServiceKey';
import {
  OkmsServiceKey,
  OkmsServiceKeyOptions,
} from '@/types/okmsServiceKey.type';

export const getOkmsServiceKeyResource = async (
  okmsId: string,
  keyId: string,
): Promise<{ data: OkmsServiceKey }> => {
  return apiClient.v2.get(`okms/resource/${okmsId}/sercviceKey/${keyId}`);
};

export const useAllOkmsServiceKeys = (okmsId: string) => {
  return useQuery({
    queryKey: getOkmsServiceKeyResourceListQueryKey(okmsId),
    queryFn: () => getListingOkmsServiceKey(okmsId),
    retry: false,
    ...{
      keepPreviousData: true,
    },
    refetchInterval: 5000,
  });
};

export const useOkmsServiceKeyById = (okmsId: string, keyId: string) => {
  return useQuery<{ data: OkmsServiceKey }, ErrorResponse>({
    queryKey: getOkmsServiceKeyResourceQueryKey(okmsId, keyId),
    queryFn: () => getOkmsServiceKeyResource(okmsId, keyId),
    retry: false,
    ...{
      keepPreviousData: true,
    },
    refetchInterval: 5000,
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
