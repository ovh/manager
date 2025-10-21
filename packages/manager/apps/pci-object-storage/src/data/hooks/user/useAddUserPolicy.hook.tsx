import { useMutation } from '@tanstack/react-query';
import { ObjStoError } from '@/data/api';
import { PolicyProps, addUserPolicy } from '@/data/api/user/user.api';

export interface UseAddUserPolicy {
  onError: (cause: ObjStoError) => void;
  onSuccess: () => void;
}

export function useAddUserPolicy({ onError, onSuccess }: UseAddUserPolicy) {
  const mutation = useMutation({
    mutationFn: (policyInfo: PolicyProps) => {
      return addUserPolicy(policyInfo);
    },
    onError,
    onSuccess,
  });

  return {
    addUserPolicy: (policyInfo: PolicyProps) => {
      return mutation.mutate(policyInfo);
    },
    ...mutation,
  };
}
