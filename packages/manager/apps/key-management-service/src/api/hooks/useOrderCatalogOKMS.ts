import { useQuery } from '@tanstack/react-query';
import { OKMSCatalog } from '@/types/orderCatalogOKMS.interface';
import { ErrorResponse } from '@/types/api.interface';
import { getOrderCatalogOKMS } from '../orderCatalogOKMS';

export type OrderCatalogProps = {
  ovhSubsidiary: string;
};

export const useOrderCatalogOKMS = (ovhSubsidiary: string) => {
  return useQuery<OKMSCatalog, ErrorResponse>({
    queryKey: ['order/catalog/public/okms', ovhSubsidiary],
    queryFn: () => getOrderCatalogOKMS(ovhSubsidiary),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};
