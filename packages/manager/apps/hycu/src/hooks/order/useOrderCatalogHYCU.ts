import { useQuery } from '@tanstack/react-query';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { ErrorResponse } from '@/types/api.type';
import { getOrderCatalogHYCU } from '../../data/api/orderCatalogHYCU';
import { HYCUCatalog } from '@/types/orderCatalogHYCU.type';

export type OrderCatalogProps = {
  ovhSubsidiary: OvhSubsidiary;
};

export const useOrderCatalogHYCU = (ovhSubsidiary: OvhSubsidiary) => {
  const options: Record<string, unknown> = {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  };
  return useQuery<HYCUCatalog, ErrorResponse>({
    queryKey: ['order/catalog/public/licenseHycu', ovhSubsidiary],
    queryFn: () => getOrderCatalogHYCU(ovhSubsidiary),
    ...options,
  });
};
