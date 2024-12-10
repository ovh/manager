import { useQuery } from '@tanstack/react-query';
import { getOfficeGlobalLicenses } from '@/api/license';

export const useOfficeLicenses = () => {
  return useQuery({
    queryKey: ['get', 'global', 'licenses'],
    queryFn: () => getOfficeGlobalLicenses(),
  });
};
