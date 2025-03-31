import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useOfficeServiceType } from './useOfficeServiceType';
import {
  getParentTenant,
  getOfficeParentTenantQueryKey,
} from '@/api/parentTenant';
import {
  getOfficeLicenseDetailsQueryKey,
  getOfficeLicenseDetails,
} from '@/api/license';

export const useOfficeParentTenant = () => {
  const { serviceName } = useParams();
  const serviceType = useOfficeServiceType(serviceName);
  const isPrepaid = serviceType === 'prepaid';

  return useQuery({
    queryKey: [
      isPrepaid
        ? getOfficeParentTenantQueryKey(serviceName)
        : getOfficeLicenseDetailsQueryKey(serviceName),
    ],
    queryFn: isPrepaid
      ? () => getParentTenant(serviceName)
      : () => getOfficeLicenseDetails(serviceName),
    enabled: !!serviceName,
  });
};
