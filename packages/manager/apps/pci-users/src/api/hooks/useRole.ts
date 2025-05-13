import { useMutation, useQuery } from '@tanstack/react-query';
import queryClient from '@/queryClient';
import { getAllRoles, updateRoles } from '@/api/data/role';

export const useAllRoles = (projectId: string) => {
  return useQuery({
    queryKey: ['project', projectId, 'roles'],
    queryFn: () => getAllRoles(projectId),
    retry: false,
  });
};

type EditRolesProps = {
  projectId: string;
  userId: number;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useUpdateUserRoles = ({
  projectId,
  userId,
  onError,
  onSuccess,
}: EditRolesProps) => {
  const mutation = useMutation({
    mutationFn: (rolesIds: string[]) => {
      return updateRoles(projectId, userId, rolesIds);
    },
    onError,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'users'],
      });
      onSuccess();
    },
  });

  return {
    update: (rolesIds: string[]) => {
      return mutation.mutate(rolesIds);
    },
    ...mutation,
  };
};
