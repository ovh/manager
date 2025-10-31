import { useQuery } from '@tanstack/react-query';
import { OKMSCatalog } from '@key-management-service/types/orderCatalogOKMS.type';
import { ErrorResponse } from '@/common/types/api.type';
import { getOrderCatalogOKMS } from '../api/orderCatalogOKMS';
import { useShellContext } from '@/common/hooks/useShellContext';

export type OrderCatalogProps = {
  ovhSubsidiary: string;
};

export const useOrderCatalogOkms = () => {
  const { environment } = useShellContext();
  const { ovhSubsidiary } = environment.getUser();
  return useQuery<OKMSCatalog, ErrorResponse>({
    queryKey: ['order/catalog/public/okms', ovhSubsidiary],
    queryFn: () => getOrderCatalogOKMS(ovhSubsidiary),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};
