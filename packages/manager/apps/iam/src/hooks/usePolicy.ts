import { useQuery } from '@tanstack/react-query';

import { getPolicy } from '@/api/iam';

export default function useResourceGroup(policyId: string) {
  const { data: policy, isLoading: isPolicyLoading } = useQuery(
    ['iam_policy', policyId],
    () => getPolicy(policyId),
  );

  return {
    policy,
    isPolicyLoading,
  };
}
