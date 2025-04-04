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

export interface MutationProps {
  projectId: string;
  onError?: (error: Error) => void;
  onSuccess?: (token: TokenData) => void;
}

export function useGetTokens({ projectId }: PCI) {
  const queryKey = ['tokens', projectId];

  return useQuery<string[], Error>({
    queryKey,
    queryFn: () => getTokens({ projectId }),
  });
}

export function useGetToken({ projectId, name }: TokenData) {
  const queryKey = ['tokens', projectId, name];

  return useQuery<database.token.TokenData, Error>({
    queryKey,
    queryFn: () => getTokens({ projectId, name }),
  });
}

export const useCreateToken = ({
  projectId,
  onError,
  onSuccess,
}: MutationProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: TokensPayload) => {
      return createToken(payload);
    },
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
}: MutationProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: TokensPayload) => updateToken(payload),
    onError,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['tokens', projectId] });
      if (onSuccess) onSuccess(data);
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
}: MutationProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: { projectId: string; name: string }) =>
      deleteToken(payload),
    onError,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['tokens', projectId] });
      if (onSuccess) {
        onSuccess(data);
      }
    },
  });
  return {
    deleteToken: (payload: { projectId: string; name: string }) =>
      mutation.mutate(payload),
    ...mutation,
  };
};
