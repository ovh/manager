import { useQueries, useQuery, useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  getProjectAcl,
  getProjectAclAccountInfo,
  AccountAcl,
  addAccountAclToProject,
  deleteAccountAclFromProject,
} from '@/data/api/acl';
import queryClient from '@/queryClient';

const getProjectAclQueryKey = (projectId: string) => [
  `/project/${projectId}/acl`,
];

export const useProjectAcl = (projectId: string) => {
  return useQuery({
    queryKey: getProjectAclQueryKey(projectId),
    queryFn: () => getProjectAcl(projectId),
  });
};

const getProjectAclAccountInfoQueryKey = (
  projectId: string,
  accountId: string,
) => [`/project/${projectId}/acl/${accountId}`];

export const useProjectAclAccountsInfo = (
  projectId: string,
  accountIds: string[],
) => {
  return useQueries({
    queries: accountIds.map((accountId) => ({
      queryKey: getProjectAclAccountInfoQueryKey(projectId, accountId),
      queryFn: () => getProjectAclAccountInfo(projectId, accountId),
    })),
    combine: (queriesResults) =>
      queriesResults.filter(({ data }) => !!data).map(({ data }) => data),
  });
};

export type TAddAccountAclToProjectArguments = {
  projectId: string;
  onSuccess: (account: AccountAcl) => void;
  onError: (error: ApiError, accountAcl: AccountAcl) => void;
};

export const useAddAccountAclToProject = ({
  projectId,
  onSuccess,
  onError,
}: TAddAccountAclToProjectArguments) => {
  const mutation = useMutation({
    mutationFn: (account: AccountAcl) =>
      addAccountAclToProject(projectId, account),
    onError,
    onSuccess: async (account: AccountAcl) => {
      queryClient.invalidateQueries({
        queryKey: getProjectAclQueryKey(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: getProjectAclAccountInfoQueryKey(
          projectId,
          account.accountId,
        ),
      });
      onSuccess(account);
    },
  });
  return {
    addAccountAclToProject: (data: AccountAcl) => mutation.mutate(data),
    ...mutation,
  };
};

export type TRemoveAccountAclFromProjectArguments = {
  projectId: string;
  onSuccess: (accountId: string) => void;
  onError: (error: ApiError, accountId: string) => void;
};

export const useDeleteAccountAclFromProject = ({
  projectId,
  onSuccess,
  onError,
}: TRemoveAccountAclFromProjectArguments) => {
  const mutation = useMutation({
    mutationFn: (accountId: string) =>
      deleteAccountAclFromProject(projectId, accountId),
    onError,
    onSuccess: async (accountId: string) => {
      queryClient.invalidateQueries({
        queryKey: getProjectAclQueryKey(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: getProjectAclAccountInfoQueryKey(projectId, accountId),
      });
      onSuccess(accountId);
    },
  });
  return {
    deleteAccountAclFromProject: (accountId: string) =>
      mutation.mutate(accountId),
    ...mutation,
  };
};
