import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddUser, addUser } from '@/data/api/database/user.api';
import { CdbError } from '@/data/api/database';
import * as database from '@/types/cloud/project/database';

export interface UseAddUser {
  onError: (cause: CdbError) => void;
  onSuccess: (user: database.service.UserWithPassword) => void;
}
export function useAddUser({
  onError,
  onSuccess: customOnSuccess,
}: UseAddUser) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (userInfo: AddUser) => {
      return addUser(userInfo);
    },
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'database',
          variables.engine,
          variables.serviceId,
          'user',
        ],
      });
      customOnSuccess(data);
    },
  });

  return {
    addUser: (userInfo: AddUser) => {
      return mutation.mutate(userInfo);
    },
    ...mutation,
  };
}
