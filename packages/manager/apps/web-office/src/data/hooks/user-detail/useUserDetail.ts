import { useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { getOfficePrepaidLicenseDetails } from '@/data/api/license/api';
import { getOfficeLicenseDetailsQueryKey } from '@/data/api/license/key';
import { LicensePrepaidType } from '@/data/api/license/type';
import { getOfficeUserDetail } from '@/data/api/users/api';
import { getOfficeUserDetailQueryKey } from '@/data/api/users/key';
import { UserNativeType } from '@/data/api/users/type';

export const useUserDetail = (activationEmail: string, licencePrepaidName?: string) => {
  const { serviceName } = useParams();
  return useQuery({
    queryKey: [
      licencePrepaidName
        ? getOfficeLicenseDetailsQueryKey(licencePrepaidName)
        : getOfficeUserDetailQueryKey(serviceName, activationEmail),
      licencePrepaidName,
      serviceName,
      activationEmail,
    ],
    queryFn: (): Promise<UserNativeType | LicensePrepaidType> =>
      licencePrepaidName
        ? getOfficePrepaidLicenseDetails(licencePrepaidName)
        : getOfficeUserDetail(serviceName, activationEmail),
    enabled: !!serviceName && !!(activationEmail || licencePrepaidName),
  });
};
