import {
  QueryObserverOptions,
  UseQueryResult,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/models/database';
import {
  AddUserProps,
  DeleteUserProps,
  GenericUser,
  ResetUserPasswordProps,
  addUser,
  deleteUser,
  getRoles,
  getUsers,
  resetUserPassword,
} from '@/api/databases/users';

export function useGetUsers(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'user'];
  return useQuery({
    queryKey,
    queryFn: () => getUsers({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<GenericUser[], Error>;
}

export function useGetRoles(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'roles'];
  return useQuery({
    queryKey,
    queryFn: () => getRoles({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<string[], Error>;
}

interface MutateUserProps {
  onError: (cause: Error) => void;
  onSuccess: (user: GenericUser) => void;
}
export function useAddUser({ onError, onSuccess }: MutateUserProps) {
  const mutation = useMutation({
    mutationFn: (userInfo: AddUserProps) => {
      return addUser(userInfo);
    },
    onError,
    onSuccess,
  });

  return {
    addUser: (userInfo: AddUserProps) => {
      return mutation.mutate(userInfo);
    },
    ...mutation,
  };
}

interface MutateUserPasswordProps {
  onError: (cause: Error) => void;
  onSuccess: (user: database.service.UserWithPassword) => void;
}
export function useResetUserPassword({
  onError,
  onSuccess,
}: MutateUserPasswordProps) {
  const mutation = useMutation({
    mutationFn: (userInfo: ResetUserPasswordProps) => {
      return resetUserPassword(userInfo);
    },
    onError,
    onSuccess,
  });

  return {
    resetUserPassword: (userInfo: ResetUserPasswordProps) => {
      return mutation.mutate(userInfo);
    },
    ...mutation,
  };
}

interface UseDeleteUserProps {
  onError: (cause: Error) => void;
  onSuccess: () => void;
}
export function useDeleteUser({ onError, onSuccess }: UseDeleteUserProps) {
  const mutation = useMutation({
    mutationFn: (userInfo: DeleteUserProps) => {
      return deleteUser(userInfo);
    },
    onError,
    onSuccess,
  });

  return {
    deleteUser: (userInfo: DeleteUserProps) => {
      return mutation.mutate(userInfo);
    },
    ...mutation,
  };
}
