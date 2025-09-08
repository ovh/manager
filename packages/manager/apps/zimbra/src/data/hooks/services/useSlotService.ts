import { useParams } from 'react-router-dom';

import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';

import { ServiceDetails } from '@ovh-ux/manager-react-components';

import { getServiceByResourceName, getServiceByResourceNameQueryKey } from '@/data/api';

type Options = Omit<UseQueryOptions, 'queryKey' | 'queryFn'>;

export const useSlotService = (options: Options = {}) => {
  const { slotId } = useParams();
  return useQuery({
    ...options,
    queryKey: getServiceByResourceNameQueryKey(slotId),
    queryFn: () => getServiceByResourceName(slotId),
  }) as UseQueryResult<ServiceDetails>;
};
