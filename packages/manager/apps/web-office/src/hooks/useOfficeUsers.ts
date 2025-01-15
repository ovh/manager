import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getOfficeUsers, getOfficeUsersQueryKey } from '@/api/users';
import { useOfficeServiceType } from './useOfficeServiceType';
import {
  getOfficePrepaidLicenses,
  getOfficeLicenseQueryKey,
  getOfficePrepaidLicenseDetails,
} from '@/api/license';

export const useOfficeUsers = () => {
  const { serviceName } = useParams();
  const isPostpaidLicence = useOfficeServiceType(serviceName) === 'payAsYouGo';
  return useQuery({
    queryKey: [
      isPostpaidLicence
        ? getOfficeUsersQueryKey(serviceName)
        : getOfficeLicenseQueryKey(serviceName),
    ],
    queryFn: isPostpaidLicence
      ? () => getOfficeUsers(serviceName)
      : () =>
          getOfficePrepaidLicenses(serviceName).then((data) => {
            const [tenant] = serviceName.split('-');
            return Promise.all(
              data
                .filter((license) => license.includes(tenant))
                .map((license) => getOfficePrepaidLicenseDetails(license)),
            );
          }),
    enabled: !!serviceName,
  });
};
