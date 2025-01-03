import { useQuery } from '@tanstack/react-query';
import { getOrganisationList } from '../../api/ips';

export const useOrganisationList = () =>
  useQuery({
    queryKey: ['organisationList'],
    queryFn: getOrganisationList,
  });
