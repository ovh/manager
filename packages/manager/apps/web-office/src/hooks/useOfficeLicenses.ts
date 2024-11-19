import { useQuery } from '@tanstack/react-query';
import { aapi } from '@ovh-ux/manager-core-api';
import { LicenseType } from '@/api/license/type';
import { getOfficeLicenseQueryKey } from '@/api/license/key';

const getOfficeLicenses = async (): Promise<LicenseType[]> => {
  const response = await aapi.get('service', {
    params: {
      external: false,
      type: '/license/office',
    },
  });
  return response.data;
};

export const useOfficeLicenses = () => {
  return useQuery({
    queryKey: [getOfficeLicenseQueryKey],
    queryFn: getOfficeLicenses,
  });
};
