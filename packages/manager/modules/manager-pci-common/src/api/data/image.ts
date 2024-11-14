import { v6 } from '@ovh-ux/manager-core-api';

export type TImage = {
  creationDate: string;
  flavorType?: string;
  id: string;
  minDisk: number;
  minRam: number;
  name: string;
  planCode: string;
  region: string;
  size: number;
  status: string;
  tags: unknown[];
  type: string;
  user: string;
  visibility: string;
};

export const getImages = async (projectId: string): Promise<TImage[]> => {
  const { data } = await v6.get<TImage[]>(`/cloud/project/${projectId}/image`);
  return data;
};
