import { v6 } from '@ovh-ux/manager-core-api';

export type TArchiveContainer = {
  name: string;
  status: string;
  virtualHost: string;
  ownerId: number;
  objectsCount: number;
  objectsSize: number;
  createdAt: string;
  automaticDeletionAt: string | null;
  lockedUntil: string | null;
};

export const getArchiveContainers = async (
  projectId: string,
  region: string,
): Promise<TArchiveContainer[]> => {
  const { data } = await v6.get(
    `/cloud/project/${projectId}/region/${region}/coldArchive`,
  );
  return data;
};

export const deleteArchive = async ({
  name,
  projectId,
  region,
}: {
  projectId: string;
  region: string;
  name: string;
}) => {
  const { data } = await v6.delete(
    `/cloud/project/${projectId}/region/${region}/coldArchive/${name}`,
  );

  return data;
};

export const addUserToContainer = async ({
  projectId,
  region,
  storageId,
  userId,
  role,
}: {
  projectId: string;
  region: string;
  storageId: string;
  userId: number;
  role: string;
}) => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/region/${region}/storage/${storageId}/policy/${userId}`,
    {
      roleName: role,
    },
  );
  return data;
};

export const restoreArchive = async ({
  projectId,
  region,
  name,
}: {
  projectId: string;
  region: string;
  name: string;
}) => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/region/${region}/coldArchive/${name}/restore`,
  );

  return data;
};

export const startArchive = async ({
  projectId,
  region,
  name,
  lockedUntilDays,
}: {
  projectId: string;
  region: string;
  name: string;
  lockedUntilDays: number;
}) => {
  const params = lockedUntilDays ? { lockedUntilDays } : {};

  const { data } = await v6.post(
    `/cloud/project/${projectId}/region/${region}/coldArchive/${name}/archive`,
    params,
  );

  return data;
};

export const createArchiveContainer = async ({
  projectId,
  region,
  ownerId,
  name,
}: {
  projectId: string;
  region: string;
  ownerId: number;
  name: string;
}) => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/region/${region}/coldArchive`,
    {
      name,
      ownerId,
    },
  );
  return data;
};

export const flushArchive = async ({
  projectId,
  region,
  name,
}: {
  projectId: string;
  region: string;
  name: string;
}) => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/region/${region}/coldArchive/${name}/destroy`,
  );

  return data;
};
