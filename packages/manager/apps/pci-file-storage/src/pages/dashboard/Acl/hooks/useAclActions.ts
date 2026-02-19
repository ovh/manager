import { useAclCreation } from '@/pages/dashboard/Acl/hooks/useAclCreation';
import { useAclDeletion } from '@/pages/dashboard/Acl/hooks/useAclDeletion';

type TUseAclActionsCallbacks = {
  onCreateSuccess?: () => void;
  onCreateError?: (errorMessage: string) => void;
  onDeleteSuccess?: () => void;
  onDeleteError?: (errorMessage: string) => void;
};

export const useAclActions = ({
  onCreateSuccess,
  onCreateError,
  onDeleteSuccess,
  onDeleteError,
}: TUseAclActionsCallbacks = {}) => {
  const { createAcl, isPending: isCreatePending } = useAclCreation({
    onSuccess: onCreateSuccess,
    onError: onCreateError,
  });

  const { deleteAcl, isPending: isDeletePending } = useAclDeletion({
    onSuccess: onDeleteSuccess,
    onError: onDeleteError,
  });

  return {
    createAcl,
    deleteAcl,
    isDeletePending,
    isCreatePending,
  };
};
