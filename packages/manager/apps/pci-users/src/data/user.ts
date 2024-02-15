import { v6 } from '@ovh-ux/manager-core-api';
import { User } from '@/interface';

export type PaginationOptions = {
  page: number;
  pageSize: number;
};

export type SortingOptions = {
  id: string;
  desc: boolean;
}[];

export type UsersOptions = {
  pagination: PaginationOptions;
  sorting: SortingOptions;
};

export const getAllUsers = async (projectId: string): Promise<User[]> => {
  const { data } = await v6.get(`/cloud/project/${projectId}/user`);

  return data;
};

export const getUser = async (
  projectId: string,
  userId: string,
): Promise<User> => {
  const { data } = await v6.get(`/cloud/project/${projectId}/user/${userId}`);

  return data;
};

export const paginateResults = (
  items: User[],
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

export const filterUsers = (
  users: User[],
  sorting: SortingOptions,
  searchQueries?: string[],
): User[] => {
  const data = [...users];

  if (sorting?.length) {
    const { desc } = sorting[0];

    if (desc) {
      data.reverse();
    }
  }

  if (searchQueries?.length) {
    return (data || []).filter(({ description }) => {
      let matchAll = true;
      searchQueries.forEach((query) => {
        matchAll =
          matchAll &&
          `${description}`.toLowerCase().includes(query.toLowerCase());
      });
      return matchAll;
    });
  }

  return data;
};
export const removeUser = async (projectId: string, userId: string) => {
  await v6.delete(`/cloud/project/${projectId}/user/${userId}`);
};
