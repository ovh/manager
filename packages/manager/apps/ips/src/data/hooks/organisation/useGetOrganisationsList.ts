import { useQuery } from '@tanstack/react-query';

import { getOrganisationList, getOrganisationListQueryKey } from '@/data/api';

export const useGetOrganisationsList = () => {
  const {
    data: organisationsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: getOrganisationListQueryKey(),
    queryFn: getOrganisationList,
  });

  return {
    organisations: organisationsResponse?.data,
    isLoading,
    isError,
    error,
  };
};
