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

export const useCreateToken = ({
  projectId,
  onError,
  onSuccess,
}: {
  projectId: string;
  onError?: (error: Error) => void;
  onSuccess?: (token: TokenData) => void;
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<TokenData, Error, TokensPayload>({
    mutationFn: async (payload: TokensPayload) => createToken(payload),
    onError,
    onSuccess: async (newToken) => {
      await queryClient.invalidateQueries({ queryKey: ['tokens', projectId] });
      if (onSuccess) {
        onSuccess(newToken);
      }
    },
  });
  return {
    createToken: (payload: TokensPayload) => mutation.mutate(payload),
    ...mutation,
  };
};

export const useUpdateToken = ({
  projectId,
  onError,
  onSuccess,
}: {
  projectId: string;
  onError?: (error: Error) => void;
  onSuccess?: (token: TokenData) => void;
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<TokenData, Error, TokensPayload>({
    mutationFn: async (payload: TokensPayload) => updateToken(payload),
    onError,
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['tokens', projectId] });
      const tokenName = variables.name;
      if (tokenName) {
        await queryClient.invalidateQueries({
          queryKey: ['tokens', projectId, tokenName],
        });
      }
      if (onSuccess) {
        onSuccess(data);
      }
    },
  });
  return {
    updateToken: (payload: TokensPayload) => mutation.mutate(payload),
    ...mutation,
  };
};

export const useDeleteToken = ({
  projectId,
  onError,
  onSuccess,
}: {
  projectId: string;
  onError?: (error: Error) => void;
  onSuccess?: (token: TokenData) => void;
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    TokenData,
    Error,
    { projectId: string; name: string }
  >({
    mutationFn: async (payload: { projectId: string; name: string }) =>
      deleteToken(payload),
    onError,
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['tokens', projectId] });
      const tokenName = variables.name;
      if (tokenName) {
        await queryClient.invalidateQueries({
          queryKey: ['tokens', projectId, tokenName],
        });
      }
      if (onSuccess) {
        onSuccess(data);
      }
    },
  });
  return {
    deleteToken: mutation.mutate,
    ...mutation,
  };
};
