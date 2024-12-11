import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useOfficeServiceType } from '../useOfficeServiceType';
import { getParentTenant } from '@/api/parentTenant/api';
import {
  getlicenseOfficeServiceQueryKey,
  getOfficeLicenseDetails,
} from '@/api/license/api';
import { getOfficeParentTenantQueryKey } from '@/api/parentTenant/key';

export const getOfficeParentTenant = () => {
  const { serviceName } = useParams();
  const serviceType = useOfficeServiceType(serviceName);
  const isPrepaid = serviceType === 'prepaid';

  return useQuery({
    queryKey: [
      isPrepaid
        ? getOfficeParentTenantQueryKey(serviceName)
        : getlicenseOfficeServiceQueryKey(serviceName),
    ],
    queryFn: isPrepaid
      ? () => getParentTenant(serviceName)
      : () => getOfficeLicenseDetails(serviceName),
  });
};
