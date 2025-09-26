import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';

import { Order } from '@ovh-ux/manager-module-order';

import { getZimbraUpgradeOrder, getZimbraUpgradeOrderQueryKey } from '@/data/api';

type Props = Omit<UseQueryOptions, 'queryKey' | 'queryFn'> & {
  planCode?: string;
  serviceName: string;
};

export const useUpgradeOrder = (props: Props) => {
  const { planCode, serviceName, ...options } = props;

  return useQuery({
    ...options,
    queryKey: getZimbraUpgradeOrderQueryKey({ planCode, serviceName }),
    queryFn: () => getZimbraUpgradeOrder({ planCode, serviceName }),
  }) as UseQueryResult<Order>;
};
