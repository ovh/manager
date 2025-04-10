import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import user from '@/types/User';
import { AIError } from '@/data/api';
import { AddUserProps, addUser } from '@/data/api/user/user.api';

export interface MutateUserProps {
  onError: (cause: AIError) => void;
  onAddSuccess: (user: user.UserDetail) => void;
}

export function useAddUser({ onError, onAddSuccess }: MutateUserProps) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (userInfo: AddUserProps) => {
      return addUser(userInfo);
    },
    onError,
    onSuccess: (userInfo) => {
      queryClient.invalidateQueries({ queryKey: [projectId, 'user'] });
      onAddSuccess(userInfo);
    },
  });

  return {
    addUser: (userInfo: AddUserProps) => {
      return mutation.mutate(userInfo);
    },
    ...mutation,
  };
}
