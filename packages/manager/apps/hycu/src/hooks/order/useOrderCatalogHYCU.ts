import { useQuery } from '@tanstack/react-query';
import { ErrorResponse } from '@/types/api.type';
import { getOrderCatalogHYCU } from '../../data/api/orderCatalogHYCU';
import { HYCUCatalog } from '@/types/orderCatalogHYCU.type';

export type OrderCatalogProps = {
  ovhSubsidiary: string;
};

export const useOrderCatalogHYCU = (ovhSubsidiary: string) => {
  return useQuery<HYCUCatalog, ErrorResponse>({
    queryKey: ['order/catalog/public/licenseHycu', ovhSubsidiary],
    queryFn: () => getOrderCatalogHYCU(ovhSubsidiary),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};
