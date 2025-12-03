import { useQuery } from '@tanstack/react-query';

import { getOrderCatalogOkms } from '@/common/data/api/orderCatalogOkms';
import { useShellContext } from '@/common/hooks/useShellContext';
import { ErrorResponse } from '@/common/types/api.type';
import { OkmsCatalog } from '@/common/types/orderCatalogOkms.type';

export type OrderCatalogProps = {
  ovhSubsidiary: string;
};

export const useOrderCatalogOkms = () => {
  const { environment } = useShellContext();
  const { ovhSubsidiary } = environment.getUser();
  return useQuery<OkmsCatalog, ErrorResponse>({
    queryKey: ['order/catalog/public/okms', ovhSubsidiary],
    queryFn: () => getOrderCatalogOkms(ovhSubsidiary),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};
