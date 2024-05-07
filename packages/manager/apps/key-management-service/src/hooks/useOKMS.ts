import { useQuery } from '@tanstack/react-query';
import {
  OKMSOptions,
  sortOKMS,
  getListingIceberg,
  ErrorResponse,
  getOkmsServicesResourceListQueryKey,
  getOkmsResourceQueryKey,
} from '@/api';
import { getOKMSResource } from '@/api/hooks/useApiOkms';
import { OKMS } from '@/interface';

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
