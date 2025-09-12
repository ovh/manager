import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';

import { OvhSubsidiary } from '@ovh-ux/manager-react-components';

import { getOrderCatalog } from '@/data/api/order/api';
import { getOrderCatalogQueryKey } from '@/data/api/order/key';
import { order } from '@/data/api/order/type';

type Props = Omit<UseQueryOptions, 'queryKey' | 'queryFn'> & {
  productName?: string;
  ovhSubsidiary: OvhSubsidiary;
};

export const useOrderCatalog = (props: Props) => {
  const { productName = 'officePrepaid', ovhSubsidiary, ...options } = props;

  return useQuery({
    ...options,
    queryKey: getOrderCatalogQueryKey(ovhSubsidiary, productName),
    queryFn: () => getOrderCatalog({ ovhSubsidiary, productName }),
  }) as UseQueryResult<order.publicOrder.Catalog>;
};
