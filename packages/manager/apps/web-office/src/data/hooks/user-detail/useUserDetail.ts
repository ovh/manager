import { useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { getOfficePrepaidLicenseDetails } from '@/data/api/license/api';
import { getOfficeLicenseDetailsQueryKey } from '@/data/api/license/key';
import { getOfficeUserDetail } from '@/data/api/users/api';
import { getOfficeUserDetailQueryKey } from '@/data/api/users/key';

export const useUserDetail = (activationEmail: string, licencePrepaidName?: string) => {
  const { serviceName } = useParams();
  return useQuery({
    queryKey: [
      licencePrepaidName
        ? getOfficeLicenseDetailsQueryKey(licencePrepaidName)
        : getOfficeUserDetailQueryKey(serviceName, activationEmail),
      licencePrepaidName,
    ],
    queryFn: licencePrepaidName
      ? () => getOfficePrepaidLicenseDetails(licencePrepaidName)
      : () => getOfficeUserDetail(serviceName, activationEmail),
    enabled: !!serviceName && !!(activationEmail || licencePrepaidName),
  });
};
