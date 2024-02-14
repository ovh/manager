/// en get cloud/project/{serviceName}/sshkey

import { v6 } from '@ovh-ux/manager-core-api';
import { SshKey } from '@/interface';

export type PaginationOptions = {
  page: number;
  pageSize: number;
};

export type SortingOptions = {
  id: string;
  desc: boolean;
}[];

export type SshKeysOptions = {
  pagination: PaginationOptions;
  sorting: SortingOptions;
};

export const getAllSshKeys = async (projectId: string): Promise<SshKey[]> => {
  const { data } = await v6.get(`/cloud/project/${projectId}/sshkey`);

  return data;
};

export const getSshKey = async (
  projectId: string,
  sshId: string,
): Promise<SshKey> => {
  const { data } = await v6.get(`/cloud/project/${projectId}/sshkey/${sshId}`);

  return data;
};

export const paginateResults = (
  items: SshKey[],
  pagination: PaginationOptions,
) => {
  return {
    rows: items.slice(
      pagination.page * pagination.pageSize,
      (pagination.page + 1) * pagination.pageSize,
    ),
    pageCount: Math.ceil(items.length / pagination.pageSize),
    totalRows: items.length,
  };
};

export const filterSshKeys = (
  sshKeys: SshKey[],
  sorting: SortingOptions,
  searchQueries?: string[],
): SshKey[] => {
  const data = [...sshKeys];

  if (sorting?.length) {
    const { desc } = sorting[0];

    if (desc) {
      data.reverse();
    }
  }

  if (searchQueries?.length) {
    return (data || []).filter(({ name }) => {
      let matchAll = true;
      searchQueries.forEach((query) => {
        matchAll =
          matchAll && `${name}`.toLowerCase().includes(query.toLowerCase());
      });
      return matchAll;
    });
  }

  return data;
};

export const removeSshKey = async (projectId: string, sshId: string) => {
  await v6.delete(`/cloud/project/${projectId}/sshkey/${sshId}`);
};

export const addSshKey = async (
  projectId: string,
  { name, publicKey }: SshKey,
) => {
  await v6.post(`/cloud/project/${projectId}/sshkey`, {
    name,
    publicKey,
  });
};
