import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  OKMSOptions,
  filterOKMS,
  getListingIceberg,
  paginateResults,
} from '@/api';

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

export const useOKMS = ({ pagination, sorting }: OKMSOptions) => {
  // retrieve All OKMS from API
  const {
    data: okms,
    error: allOKMSError,
    isLoading: allOKMSLoading,
  } = useAllOKMS();

  return useMemo(() => {
    return {
      isLoading: allOKMSLoading,
      error: allOKMSError,
      data: paginateResults(filterOKMS(okms || [], sorting), pagination),
    };
  }, [okms, sorting, pagination]);
};
