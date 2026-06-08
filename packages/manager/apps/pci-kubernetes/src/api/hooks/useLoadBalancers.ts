import { useQuery } from '@tanstack/react-query';

import { getLoadBalancers } from '../data/load-balancer';

export const getLoadBalancersQueryKey = (projectId: string) => [
  'project',
  projectId,
  'loadbalancer',
];

export const useHasIolbLoadBalancers = (projectId: string, enabled = true) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: getLoadBalancersQueryKey(projectId),
    queryFn: () => getLoadBalancers(projectId),
    enabled,
  });

  return {
    hasIolbLoadBalancer: (data?.length ?? 0) > 0,
    isLoading,
    isError,
  };
};

export default useHasIolbLoadBalancers;
