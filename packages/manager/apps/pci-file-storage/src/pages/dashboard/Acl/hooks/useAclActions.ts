import { useAclCreation } from '@/pages/dashboard/Acl/hooks/useAclCreation';

type TUseAclActionsCallbacks = {
  onCreateSuccess?: () => void;
  onCreateError?: (errorMessage: string) => void;
};

export const useAclActions = ({ onCreateSuccess, onCreateError }: TUseAclActionsCallbacks = {}) => {
  const { createAcl, isPending: isCreatePending } = useAclCreation({
    onSuccess: onCreateSuccess,
    onError: onCreateError,
  });

  return { createAcl, isCreatePending };
};
