import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getOfficeUsersQueryKey } from '@/api/users/key';
import { getOfficeUsers } from '@/api/users/api';
import { useOfficeServiceType } from './useOfficeServiceType';
import {
  getOfficeLicenseDetails,
  getOfficePrepaidLicenses,
} from '@/api/license/api';
import { getOfficeLicenseQueryKey } from '@/api/license/key';

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
                .map((license) => getOfficeLicenseDetails(license)),
            );
          }),
  });
};
