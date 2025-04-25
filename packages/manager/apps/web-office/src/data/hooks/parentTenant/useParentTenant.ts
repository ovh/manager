import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useServiceType } from '../serviceType/useServiceType';
import {
  getParentTenant,
  getOfficeParentTenantQueryKey,
} from '@/data/api/parentTenant';
import {
  getOfficeLicenseDetailsQueryKey,
  getOfficeLicenseDetails,
} from '@/data/api/license';

export const useParentTenant = () => {
  const { serviceName } = useParams();
  const serviceType = useServiceType(serviceName);
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
