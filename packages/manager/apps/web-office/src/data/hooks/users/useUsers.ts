import { useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { getOfficePrepaidLicenseDetails, getOfficePrepaidLicenses } from '@/data/api/license/api';
import { getOfficeLicenseQueryKey } from '@/data/api/license/key';
import { LicensePrepaidType } from '@/data/api/license/type';
import { getOfficeUsers } from '@/data/api/users/api';
import { getOfficeUsersQueryKey } from '@/data/api/users/key';
import { UserNativeType } from '@/data/api/users/type';
import { ServiceType } from '@/utils/ServiceType.utils';

export const useUsers = () => {
  const { serviceName } = useParams();
  const isPostpaidLicence = ServiceType(serviceName) === 'payAsYouGo';
  return useQuery({
    queryKey: [
      isPostpaidLicence
        ? getOfficeUsersQueryKey(serviceName)
        : getOfficeLicenseQueryKey(serviceName),
      serviceName,
      isPostpaidLicence,
    ],
    queryFn: (): Promise<UserNativeType[] | LicensePrepaidType[]> =>
      isPostpaidLicence
        ? getOfficeUsers(serviceName)
        : getOfficePrepaidLicenses(serviceName).then((data) => {
            const [tenant] = serviceName.split('-');
            return Promise.allSettled(
              data
                .filter((license) => license.includes(tenant))
                .map((license) => getOfficePrepaidLicenseDetails(license)),
            ).then((results) =>
              results
                .filter(
                  (result) =>
                    result.status === 'fulfilled' &&
                    result.value !== null &&
                    result.value !== undefined,
                )
                .map((result) => (result as PromiseFulfilledResult<LicensePrepaidType>).value),
            );
          }),
    enabled: !!serviceName,
  });
};
