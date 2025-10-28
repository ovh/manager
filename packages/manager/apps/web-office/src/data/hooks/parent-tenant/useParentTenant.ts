import { useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { getOfficeLicenseDetails } from '@/data/api/license/api';
import { getOfficeLicenseDetailsQueryKey } from '@/data/api/license/key';
import { getParentTenant } from '@/data/api/parent-tenant/api';
import { getOfficeParentTenantQueryKey } from '@/data/api/parent-tenant/key';
import { ServiceType } from '@/utils/ServiceType.utils';

export const useParentTenant = () => {
  const { serviceName } = useParams();
  const serviceType = ServiceType(serviceName);
  const isPrepaid = serviceType === 'prepaid';

  return useQuery({
    queryKey: [
      isPrepaid
        ? getOfficeParentTenantQueryKey(serviceName)
        : getOfficeLicenseDetailsQueryKey(serviceName),
      serviceName,
    ],
    queryFn: isPrepaid
      ? () => getParentTenant(serviceName)
      : () => getOfficeLicenseDetails(serviceName),
    enabled: !!serviceName,
  });
};
