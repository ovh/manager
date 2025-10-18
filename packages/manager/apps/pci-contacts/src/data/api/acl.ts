import { v6 } from '@ovh-ux/manager-core-api';

export type AccountAcl = {
  accountId: string;
  type: 'readOnly' | 'readWrite';
};

export const getProjectAcl = async (projectId: string): Promise<string[]> => {
  const { data } = await v6.get(`/cloud/project/${projectId}/acl`);
  return data;
};

export const getProjectAclAccountInfo = async (
  projectId: string,
  accountId: string,
): Promise<AccountAcl> => {
  const { data } = await v6.get(`/cloud/project/${projectId}/acl/${accountId}`);
  return data;
};

export const addAccountAclToProject = async (
  projectId: string,
  account: AccountAcl,
): Promise<AccountAcl> => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/acl?accountId=${account.accountId}`,
    account,
  );
  return data;
};

export const deleteAccountAclFromProject = async (
  projectId: string,
  accountId: string,
): Promise<string> => {
  await v6.delete(`/cloud/project/${projectId}/acl/${accountId}`);
  return accountId;
};
