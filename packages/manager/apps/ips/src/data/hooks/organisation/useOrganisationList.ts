import { useQuery } from '@tanstack/react-query';
import { getOrganisationList } from '@/data/api';

export const useOrganisationList = () =>
  useQuery({
    queryKey: ['organisationList'],
    queryFn: getOrganisationList,
  });
