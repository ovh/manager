import { useQuery } from '@tanstack/react-query';
import apiClient from '@ovh-ux/manager-core-api';

import { OKMS, OKMSOptions } from '@/types/okms.type';
import { ErrorResponse } from '@/types/api.type';
import {
  getListingIceberg,
  getOkmsResourceQueryKey,
  getOkmsServicesResourceListQueryKey,
  sortOKMS,
} from '../api/okms';

export const getOKMSResource = async (
  okmsId: string,
): Promise<{ data: OKMS }> => {
  return apiClient.v2.get(`okms/resource/${okmsId}`);
};

export const useAllOKMS = () => {
  return useQuery({
    queryKey: getOkmsServicesResourceListQueryKey,
    queryFn: () => getListingIceberg(),
    retry: false,
    ...{
      keepPreviousData: true,
    },
    refetchInterval: 5000,
  });
};

export const useOKMSById = (okmsId: string) => {
  return useQuery<{ data: OKMS }, ErrorResponse>({
    queryKey: getOkmsResourceQueryKey(okmsId),
    queryFn: () => getOKMSResource(okmsId),
    retry: false,
    ...{
      keepPreviousData: true,
    },
    refetchInterval: 5000,
  });
};

export const useOKMS = ({ sorting }: OKMSOptions) => {
  // retrieve All OKMS from API
  const {
    data: okms,
    error: allOKMSError,
    isLoading: allOKMSLoading,
  } = useAllOKMS();

  return {
    isLoading: allOKMSLoading,
    error: allOKMSError,
    data: sortOKMS(okms || [], sorting),
  };
};
