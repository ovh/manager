import { useQuery } from '@tanstack/react-query';
import { ErrorResponse, OKMSCatalog, getOrderCatalogOKMS } from '@/api';

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
