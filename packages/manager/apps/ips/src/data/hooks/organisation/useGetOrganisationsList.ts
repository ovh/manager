import { useQuery } from '@tanstack/react-query';

import { getOrganisationList, getOrganisationListQueryKey } from '@/data/api';

export const useGetOrganisationsList = () => {
  const {
    data: organisationsResponse,
    isLoading: loading,
    isError,
    error,
  } = useQuery({
    queryKey: getOrganisationListQueryKey(),
    queryFn: getOrganisationList,
  });

  return {
    organisations: organisationsResponse?.data,
    loading,
    isError,
    error,
  };
};
