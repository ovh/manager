import { OKMSCatalog } from '@key-management-service/types/orderCatalogOKMS.type';
import { useQuery } from '@tanstack/react-query';

import { useShellContext } from '@/common/hooks/useShellContext';
import { ErrorResponse } from '@/common/types/api.type';

import { getOrderCatalogOKMS } from '../api/orderCatalogOKMS';

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
