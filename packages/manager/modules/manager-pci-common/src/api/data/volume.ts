import { v6 } from '@ovh-ux/manager-core-api';

export type TVolume = {
  id: string;
  attachedTo: string[];
  creationDate: string;
  name: string;
  description: string;
  size: number;
  status: string;
  statusGroup: string;
  region: string;
  bootable: boolean;
  planCode: string | null;
  type: string;
  regionName: string;
};

export const getVolumes = async (projectId: string): Promise<TVolume[]> => {
  const { data } = await v6.get<TVolume[]>(
    `/cloud/project/${projectId}/volume`,
  );
  return data;
};
