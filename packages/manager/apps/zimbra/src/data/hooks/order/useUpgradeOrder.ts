import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';

import { Order } from '@ovh-ux/manager-module-order';

import { ZimbraPlanCodes, getZimbraUpgradeOrder, getZimbraUpgradeOrderQueryKey } from '@/data/api';

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
    enabled: (query) =>
      (typeof options.enabled === 'function'
        ? options.enabled(query)
        : typeof options.enabled !== 'boolean' || options.enabled) &&
      [ZimbraPlanCodes.ZIMBRA_STARTER, ZimbraPlanCodes.ZIMBRA_PRO].includes(
        planCode as ZimbraPlanCodes,
      ) &&
      !!serviceName,
  }) as UseQueryResult<Order>;
};
