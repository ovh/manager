import { v6, fetchIcebergV6, Filter } from '@ovh-ux/manager-core-api';
import { OPENRC_VERSION } from '@/download-openrc.constants';
import { OpenStackTokenResponse, Role, User } from '@/interface';

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

export const getAllUsers = async (
  projectId: string,
  filters: Filter[] = [],
): Promise<User[]> => {
  const { data } = await fetchIcebergV6<User>({
    route: `/cloud/project/${projectId}/user`,
    filters,
    disableCache: true,
  });

  return data;
};

export const getUser = async (
  projectId: string,
  userId: string,
): Promise<User> => {
  const { data } = await v6.get(`/cloud/project/${projectId}/user/${userId}`);

  return data;
};

export const getUserRoles = async (
  projectId: string,
  userId: string,
): Promise<Role[]> => {
  const { data } = await v6.get(
    `/cloud/project/${projectId}/user/${userId}/role`,
  );

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
  const { data } = await v6.delete(
    `/cloud/project/${projectId}/user/${userId}`,
  );
  return data;
};

export type DownloadRCloneConfigResult = {
  content: string;
};
export const downloadRCloneConfig = async (
  projectId: string,
  userId: string,
  region: string,
  service: string,
): Promise<DownloadRCloneConfigResult> => {
  const { data } = await v6.get(
    `/cloud/project/${projectId}/user/${userId}/rclone?region=${region}&service=${service}`,
  );
  return data;
};

export type DownloadOpenStackConfigResult = {
  content: string;
};
export const downloadOpenStackConfig = async (
  projectId: string,
  userId: string,
  region: string,
  openApiVersion: number,
): Promise<DownloadOpenStackConfigResult> => {
  const version = OPENRC_VERSION[`V${openApiVersion}`];
  const { data } = await v6.get(
    `/cloud/project/${projectId}/user/${userId}/openrc?region=${region}&version=${version}`,
  );
  return data;
};

export const regeneratePassword = async (
  projectId: string,
  userId: string,
): Promise<User> => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/user/${userId}/regeneratePassword`,
  );
  return data;
};

export const generateOpenStackToken = async (
  projectId: string,
  userId: string,
  password: string,
): Promise<OpenStackTokenResponse> => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/user/${userId}/token`,
    {
      password,
    },
  );
  return data;
};

export const createUser = async (
  projectId: string,
  description: string,
  roles: string[],
): Promise<User> => {
  const { data } = await v6.post(`/cloud/project/${projectId}/user/`, {
    description,
    roles,
  });
  return data;
};
