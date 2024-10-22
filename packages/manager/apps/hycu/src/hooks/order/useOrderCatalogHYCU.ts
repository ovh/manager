import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { getOrderCatalogHYCU } from '../../data/api/orderCatalogHYCU';
import { HYCUCatalog } from '@/types/orderCatalogHYCU.type';

export type OrderCatalogProps = {
  ovhSubsidiary: OvhSubsidiary;
};

export const useOrderCatalogHYCU = (
  ovhSubsidiary: OvhSubsidiary,
  options: Partial<DefinedInitialDataOptions<HYCUCatalog, ApiError>> = {},
) => {
  return useQuery<HYCUCatalog, ApiError>({
    queryKey: ['order/catalog/public/licenseHycu', ovhSubsidiary],
    queryFn: () => getOrderCatalogHYCU(ovhSubsidiary),
    ...options,
  });
};
