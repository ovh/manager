import { v6 } from '@ovh-ux/manager-core-api';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { TSshKey } from '@/interface';

export type SshKeysOptions = {
  pagination: PaginationState;
  sorting: ColumnSort;
};

export const getAllSshKeys = async (projectId: string): Promise<TSshKey[]> => {
  const { data } = await v6.get(`/cloud/project/${projectId}/sshkey`);

  return data;
};

export const getSshKey = async (
  projectId: string,
  sshId: string,
): Promise<TSshKey> => {
  const { data } = await v6.get(`/cloud/project/${projectId}/sshkey/${sshId}`);

  return data;
};

export const paginateResults = (
  items: TSshKey[],
  pagination: PaginationState,
) => ({
  rows: items.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize,
  ),
  pageCount: Math.ceil(items.length / pagination.pageSize),
  totalRows: items.length,
});

export const filterSshKeys = (
  sshKeys: TSshKey[],
  sorting: ColumnSort,
  searchQueries?: string[],
): TSshKey[] => {
  const data = [...sshKeys];

  if (sorting) {
    const { desc } = sorting;

    if (desc) {
      data.reverse();
    }
  }

  if (searchQueries?.length) {
    return (data || []).filter(({ name, publicKey }) => {
      let matchAll = true;
      searchQueries.forEach((query) => {
        matchAll =
          matchAll &&
          (name.toLowerCase().includes(query.toLowerCase()) ||
            publicKey.toLowerCase().includes(query.toLowerCase()));
      });
      return matchAll;
    });
  }

  return data;
};

export const removeSshKey = async (projectId: string, sshId: string) => {
  try {
    return await v6.delete(`/cloud/project/${projectId}/sshkey/${sshId}`);
  } catch (e) {
    throw new Error(e.response?.data?.message);
  }
};

export const addSshKey = async (
  projectId: string,
  { name, publicKey }: TSshKey,
) => {
  try {
    return await v6.post(`/cloud/project/${projectId}/sshkey`, {
      name,
      publicKey,
    });
  } catch (e) {
    throw new Error(e.response?.data?.message);
  }
};
