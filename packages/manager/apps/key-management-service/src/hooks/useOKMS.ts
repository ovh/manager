import { useQuery } from '@tanstack/react-query';
import { OKMSOptions, sortOKMS, getListingIceberg } from '@/api';

export const useAllOKMS = () => {
  return useQuery({
    queryKey: ['okms/ressource'],
    queryFn: () => getListingIceberg(),
    retry: false,
    ...{
      keepPreviousData: true,
    },
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
