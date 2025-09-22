import { useQuery } from '@tanstack/react-query';

import { getOfficeGlobalLicenses } from '@/data/api/license/api';

export const useLicenses = () => {
  return useQuery({
    queryKey: ['get', 'global', 'licenses'],
    queryFn: () => getOfficeGlobalLicenses(),
  });
};
