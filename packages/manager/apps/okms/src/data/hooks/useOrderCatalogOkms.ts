import { useQuery } from '@tanstack/react-query';
import { OKMSCatalog } from '@/types/orderCatalogOKMS.type';
import { ErrorResponse } from '@/types/api.type';
import { getOrderCatalogOKMS } from '../api/orderCatalogOKMS';

export type OrderCatalogProps = {
  ovhSubsidiary: string;
};

export const useOrderCatalogOkms = (ovhSubsidiary: string) => {
  return useQuery<OKMSCatalog, ErrorResponse>({
    queryKey: ['order/catalog/public/okms', ovhSubsidiary],
    queryFn: () => getOrderCatalogOKMS(ovhSubsidiary),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};
