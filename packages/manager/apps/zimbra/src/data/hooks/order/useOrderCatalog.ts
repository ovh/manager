import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';

import { OvhSubsidiary } from '@ovh-ux/manager-react-components';

import { getOrderCatalog, getOrderCatalogQueryKey, order } from '@/data/api';

type Props = Omit<UseQueryOptions, 'queryKey' | 'queryFn'> & {
  productName?: string;
  ovhSubsidiary: OvhSubsidiary;
};

export const useOrderCatalog = (props: Props) => {
  const { productName = 'zimbra', ovhSubsidiary, ...options } = props;

  return useQuery({
    ...options,
    queryKey: getOrderCatalogQueryKey({ ovhSubsidiary, productName }),
    queryFn: () => getOrderCatalog({ ovhSubsidiary, productName }),
  }) as UseQueryResult<order.publicOrder.Catalog>;
};
