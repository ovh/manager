import { v6 } from '@ovh-ux/manager-core-api';

export type TArchiveContainer = {
  name: string;
  status: string;
  virtualHost: string;
  ownerId: number;
  objectsCount: number;
  objectsSize: number;
  objects: any[];
  createdAt: string;
  automaticDeletionAt: string | null;
  lockedUntil: string | null;
};

export const getArchiveContainers = async (
  projectId: string,
  region: string,
): Promise<TArchiveContainer[]> => {
  //   return PciStoragesColdArchiveService.getArchiveContainers(
  //     projectId,
  //     regions[0],
  //   );
  const { data } = await v6.get(
    `/cloud/project/${projectId}/region/${region}/coldArchive`,
  );
  return data;
};
