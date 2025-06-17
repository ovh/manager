import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import {
  getTokens,
  createToken,
  updateToken,
  deleteToken,
} from '@/data/api/database/token.api';
import {
  PCI,
  TokenData,
  TokensPayload,
} from '@/types/cloud/project/database/token';
import { getTokenQueryOptions } from '@/components/utils/getTokenQueries';

interface ApiError extends Error {
  response?: { status?: number };
}

interface UseTokenMutationOptions {
  projectId: string;
  onError?: (error: ApiError) => void;
  onSuccess?: (token: TokenData) => void;
}

export function useGetTokens({ projectId }: PCI) {
  return useQuery<string[], Error>({
    queryKey: ['tokens', projectId],
    queryFn: () => getTokens({ projectId }),
  });
}

export function useGetToken({ projectId, name }: TokenData) {
  return useQuery<database.token.TokenData, Error>(
    getTokenQueryOptions(projectId, name),
  );
}

function useTokenMutationHandler<TPayload, TResult extends TokenData>(
  projectId: string,
  mutationFn: (payload: TPayload) => Promise<TResult>,
  invalidateExtra?: (variables: TPayload) => Promise<void>,
  options?: Pick<UseTokenMutationOptions, 'onError' | 'onSuccess'>,
) {
  const queryClient = useQueryClient();
  const [isRestricted, setIsRestricted] = useState(false);

  const mutation = useMutation<TResult, ApiError, TPayload>({
    mutationFn,
    onError: (error) => {
      // Only set restricted when HTTP 403
      const status = error.response?.status;
      setIsRestricted(status === 403);
      options?.onError?.(error);
    },
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['tokens', projectId] });
      if (invalidateExtra) {
        await invalidateExtra(variables);
      }
      setIsRestricted(false);
      options?.onSuccess?.(data);
    },
  });

  return {
    mutate: (payload: TPayload) => mutation.mutate(payload),
    isRestricted,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    ...mutation,
  };
}

export const useCreateToken = ({
  projectId,
  onError,
  onSuccess,
}: UseTokenMutationOptions) =>
  useTokenMutationHandler<TokensPayload, TokenData>(
    projectId,
    createToken,
    undefined,
    { onError, onSuccess },
  );

export const useUpdateToken = ({
  projectId,
  onError,
  onSuccess,
}: UseTokenMutationOptions) =>
  useTokenMutationHandler<TokensPayload, TokenData>(
    projectId,
    updateToken,
    async (variables) => {
      if (variables.name) {
        await useQueryClient().invalidateQueries({
          queryKey: ['tokens', projectId, variables.name],
        });
      }
    },
    { onError, onSuccess },
  );

export const useDeleteToken = ({
  projectId,
  onError,
  onSuccess,
}: UseTokenMutationOptions) =>
  useTokenMutationHandler<{ projectId: string; name: string }, TokenData>(
    projectId,
    deleteToken,
    async (variables) => {
      if (variables.name) {
        await useQueryClient().invalidateQueries({
          queryKey: ['tokens', projectId, variables.name],
        });
      }
    },
    { onError, onSuccess },
  );

export const useTokenMutations = ({
  projectId,
  onError,
  onSuccess,
}: UseTokenMutationOptions) => {
  const create = useCreateToken({ projectId, onError, onSuccess });
  const update = useUpdateToken({ projectId, onError, onSuccess });
  const deletion = useDeleteToken({ projectId, onError, onSuccess });

  return {
    createToken: create.mutate,
    updateToken: update.mutate,
    deleteToken: deletion.mutate,
    isRestricted:
      create.isRestricted || update.isRestricted || deletion.isRestricted,
    isCreateSuccess: create.isSuccess,
  };
};
