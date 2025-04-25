import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getOfficeUsers, getOfficeUsersQueryKey } from '@/data/api/users';
import { useServiceType } from '../serviceType/useServiceType';
import {
  getOfficePrepaidLicenses,
  getOfficeLicenseQueryKey,
  getOfficePrepaidLicenseDetails,
} from '@/data/api/license';

export const useUsers = () => {
  const { serviceName } = useParams();
  const isPostpaidLicence = useServiceType(serviceName) === 'payAsYouGo';
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
                .map((result) => (result as PromiseFulfilledResult<any>).value),
            );
          }),
    enabled: !!serviceName,
  });
};
