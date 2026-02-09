import { useQuery } from '@tanstack/react-query';
import { IamPolicy, getIamPolicies } from '@/data/api/iam-policies';

export const useGetIamPolicies = () => {
  return useQuery<IamPolicy[]>({
    queryKey: ['/iam/policy'],
    queryFn: () => getIamPolicies(),
  });
};

export const getIamPoliciesForIdentityQueryKey = (identity: string) => [
  'iam-policy',
  'by-identity',
  identity,
];

export const useGetIamPoliciesForIdentity = (identity: string | null) => {
  return useQuery<IamPolicy[]>({
    queryKey: getIamPoliciesForIdentityQueryKey(identity),
    queryFn: () => getIamPolicies({ identities: [identity] }),
    enabled: !!identity
  });
};
