import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { compareFunction, paginateResults } from '@/helpers';
import {
  deleteRegistry,
  getAllRegistries,
  getRegistryPlan,
  renameRegistry,
  TRegistry,
  postRegistryCredentials,
  getRegistryAvailablePlans,
  updatePlan,
  TRegistryCredentials,
} from '../data/registry';
import queryClient from '@/queryClient';

export const getRegistryQueryPrefix = (projectId: string) => [
  'project',
  projectId,
  'registry',
];

export const getAllRegistriesQueryKey = (projectId: string) => [
  ...getRegistryQueryPrefix(projectId),
];

export const getRegistryPlanQueryKey = (
  projectId: string,
  registryId: string,
) => [...getRegistryQueryPrefix(projectId), registryId, 'plan'];

export const getRegistryAvailablePlansQueryKey = (
  projectId: string,
  registryId: string,
) => [...getRegistryQueryPrefix(projectId), registryId, 'available-plans'];

export const getRegistryCredentialsQueryKey = (
  projectId: string,
  registryId: string,
) => [...getRegistryQueryPrefix(projectId), registryId, 'users'];

export const useGetAllRegistries = (projectId: string) =>
  useQuery({
    queryKey: getAllRegistriesQueryKey(projectId),
    queryFn: () => getAllRegistries(projectId),
    select: (registries) =>
      registries.map((registry) => ({
        ...registry,
        search: `${registry.name} ${registry.id} ${registry.region} ${registry.version}`,
      })) as TRegistry[],
  });

export const useGetRegistryPlan = (projectId: string, registryId: string) =>
  useQuery({
    queryKey: getRegistryPlanQueryKey(projectId, registryId),
    queryFn: () => getRegistryPlan(projectId, registryId),
  });

export const useGetRegistryAvailablePlans = (
  projectId: string,
  registryId: string,
) =>
  useQuery({
    queryKey: getRegistryAvailablePlansQueryKey(projectId, registryId),
    queryFn: () => getRegistryAvailablePlans(projectId, registryId),
  });

export const sortRegistries = (
  registries: TRegistry[],
  sorting: ColumnSort,
): TRegistry[] => {
  const data = [...registries];

  if (sorting) {
    const { id: sortKey, desc } = sorting;

    data.sort(compareFunction<TRegistry>(sortKey as keyof TRegistry));
    if (desc) {
      data.reverse();
    }
  }

  return data;
};

export const useAllRegistries = (
  projectId: string,
  pagination: PaginationState,
  filters: Filter[],
  sorting: ColumnSort,
) => {
  const { data: allRegistries, error, isPending } = useGetAllRegistries(
    projectId,
  );

  return useMemo(
    () => ({
      isPending,
      data: paginateResults<TRegistry>(
        applyFilters(sortRegistries(allRegistries || [], sorting), filters),
        pagination,
      ),
      error,
    }),
    [allRegistries, isPending, error, pagination, filters, sorting],
  );
};

type DeleteRegistryProps = {
  projectId: string;
  registryId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useDeleteRegistry = ({
  projectId,
  registryId,
  onError,
  onSuccess,
}: DeleteRegistryProps) => {
  const mutation = useMutation({
    mutationFn: async () => deleteRegistry(projectId, registryId),
    onError,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: getRegistryQueryPrefix(projectId),
      });
      onSuccess();
    },
  });
  return {
    deleteRegistry: () => mutation.mutate(),
    ...mutation,
  };
};

type RenameRegistryProps = {
  projectId: string;
  registryId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useRenameRegistry = ({
  projectId,
  registryId,
  onError,
  onSuccess,
}: RenameRegistryProps) => {
  const mutation = useMutation({
    mutationFn: async (name: string) =>
      renameRegistry(projectId, registryId, name),
    onError,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: getRegistryQueryPrefix(projectId),
      });
      onSuccess();
    },
  });
  return {
    renameRegistry: (name: string) => mutation.mutate(name),
    ...mutation,
  };
};

interface PostRegistryCredentialsParams {
  projectId: string;
  registryId: string;
  onSuccess?: (credentials: TRegistryCredentials) => void;
  onError?: (cause: Error) => void;
}

export const usePostRegistryCredentials = ({
  projectId,
  registryId,
  onSuccess,
  onError,
}: Readonly<PostRegistryCredentialsParams>) => {
  const mutation = useMutation({
    mutationFn: async () => postRegistryCredentials(projectId, registryId),
    onError,
    onSuccess,
  });
  return {
    generateCredentials: () => mutation.mutate(),
    ...mutation,
  };
};

export type TUpdatePlanParam = {
  projectId: string;
  registryId: string;
  planId: string;
  onError: (e: {
    response: { data: { message: never } };
    error: { message: never };
    message: never;
  }) => void;
  onSuccess: () => void;
};

export const useUpdatePlan = ({
  projectId,
  registryId,
  planId,
  onError,
  onSuccess,
}: TUpdatePlanParam) => {
  const mutation = useMutation({
    mutationFn: async () => updatePlan(projectId, registryId, planId),
    onError,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: getRegistryQueryPrefix(projectId),
      });
      onSuccess();
    },
  });
  return {
    updatePlan: () => mutation.mutate(),
    ...mutation,
  };
};
