import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { updateOfficeLicenseDetails } from '@/api/license/api';
import { updateParentTenant } from '@/api/parentTenant/api';
import { useOfficeServiceType } from '../useOfficeServiceType';
import { ParentTenantType } from '@/api/parentTenant/type';
import { LicenseType } from '@/api/license/type';

export const updateOfficeParentTenant = () => {
  const { serviceName } = useParams();
  const serviceType = useOfficeServiceType(serviceName);
  const isPrepaid = serviceType === 'prepaid';

  const queryClient = useQueryClient();

  const data = useMutation({
    mutationFn: isPrepaid
      ? (parentTenantData: Partial<ParentTenantType>) =>
          updateParentTenant(serviceName, parentTenantData)
      : (licenseData: Partial<LicenseType>) =>
          updateOfficeLicenseDetails(serviceName, licenseData),
    onSuccess: () => {
      queryClient.invalidateQueries(serviceName);
    },
  });

  return {
    data,
    isPrepaid,
  };
};
