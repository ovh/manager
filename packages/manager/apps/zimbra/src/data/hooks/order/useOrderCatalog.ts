import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';

import { Subsidiary } from '@ovh-ux/manager-config';

import { getOrderCatalog, getOrderCatalogQueryKey, order } from '@/data/api';

type Props = Omit<UseQueryOptions, 'queryKey' | 'queryFn'> & {
  productName?: string;
  ovhSubsidiary: Subsidiary;
};

export const useOrderCatalog = (props: Props) => {
  const { productName = 'zimbra', ovhSubsidiary, ...options } = props;

  return useQuery({
    ...options,
    queryKey: getOrderCatalogQueryKey({ ovhSubsidiary, productName }),
    queryFn: () => getOrderCatalog({ ovhSubsidiary, productName }),
  }) as UseQueryResult<order.publicOrder.Catalog>;
};
