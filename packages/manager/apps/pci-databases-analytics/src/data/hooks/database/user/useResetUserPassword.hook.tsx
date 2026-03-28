import { useMutation } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { ManageUser, resetUserPassword } from '@/data/api/database/user.api';
import { CdbError } from '@/data/api/database';

interface UseResetUserPassword {
  onError: (cause: CdbError) => void;
  onSuccess: (user: database.service.UserWithPassword) => void;
}
export function useResetUserPassword({
  onError,
  onSuccess,
}: UseResetUserPassword) {
  const mutation = useMutation({
    mutationFn: (userInfo: ManageUser) => {
      return resetUserPassword(userInfo);
    },
    onError,
    onSuccess,
  });

  return {
    resetUserPassword: (userInfo: ManageUser) => {
      return mutation.mutate(userInfo);
    },
    ...mutation,
  };
}
