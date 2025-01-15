import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getOfficeUserDetail, getOfficeUserDetailQueryKey } from '@/api/users';
import {
  getOfficeLicenseDetailsQueryKey,
  getOfficePrepaidLicenseDetails,
} from '@/api/license';

export const useOfficeUserDetail = (
  activationEmail: string,
  licencePrepaidName?: string,
) => {
  const { serviceName } = useParams();
  return useQuery({
    queryKey: [
      licencePrepaidName
        ? getOfficeLicenseDetailsQueryKey(licencePrepaidName)
        : getOfficeUserDetailQueryKey(serviceName, activationEmail),
    ],
    queryFn: licencePrepaidName
      ? () => getOfficePrepaidLicenseDetails(licencePrepaidName)
      : () => getOfficeUserDetail(serviceName, activationEmail),
    enabled: !!serviceName && !!(activationEmail || licencePrepaidName),
  });
};
