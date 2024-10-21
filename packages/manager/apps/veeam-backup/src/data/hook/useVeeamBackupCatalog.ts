import React from 'react';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { order } from '../catalog.type';
import { getVeeamBackupCatalog } from '../api';

export const veeamBackupCatalogQueryKey = ['catalog', 'veeam-backup'];

export const vmPlanCode = 'backup-veeam-vcd-vm';

export const useVeeamBackupVmConsumptionPricing = () => {
  const { environment } = React.useContext(ShellContext);
  const { isLoading, error, isError, data } = useQuery<
    ApiResponse<order.publicOrder.Catalog>,
    ApiError
  >({
    queryKey: veeamBackupCatalogQueryKey,
    queryFn: () => getVeeamBackupCatalog(environment.user.ovhSubsidiary),
  });

  return {
    isLoading,
    isError,
    error,
    pricing: data?.data?.addons
      ?.find((addon) => addon.planCode === vmPlanCode)
      ?.pricings?.find((pricing) =>
        pricing.capacities.includes(
          order.cart.GenericProductPricingCapacitiesEnum.consumption,
        ),
      ),
  };
};
