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

export const deleteArchiveContainer = async ({
  containerName,
  projectId,
  region,
}: {
  projectId: string;
  region: string;
  containerName: string;
}) => {
  const { data } = await v6.delete(
    `/cloud/project/${projectId}/region/${region}/coldArchive/${containerName}`,
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

export const restoreArchiveContainer = async ({
  projectId,
  region,
  containerName,
}: {
  projectId: string;
  region: string;
  containerName: string;
}) => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/region/${region}/coldArchive/${containerName}/restore`,
  );
  return data;
};
