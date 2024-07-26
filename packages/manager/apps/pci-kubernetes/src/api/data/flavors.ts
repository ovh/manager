import { v6 } from '@ovh-ux/manager-core-api';

export type TRawFlavor = {
  id: string;
  name: string;
  ram: number;
  disk: number;
  vcpus: number;
};

export const getRegionFlavors = async (
  projectId: string,
  region: string,
): Promise<TRawFlavor[]> => {
  const { data } = await v6.get<TRawFlavor[]>(
    `/cloud/project/${projectId}/flavor?region=${region}`,
  );

  return data;
};
