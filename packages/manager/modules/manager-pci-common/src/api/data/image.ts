import { v6 } from '@ovh-ux/manager-core-api';

export type TImage = {
  creationDate: string;
  flavorType: string | null;
  id: string;
  minDisk: number;
  minRam: number;
  name: string;
  planCode: string | null;
  region: string;
  size: number;
  status:
    | 'attaching'
    | 'available'
    | 'awaiting-transfer'
    | 'backing-up'
    | 'creating'
    | 'deleting'
    | 'detaching'
    | 'downloading'
    | 'error'
    | 'error_backing-up'
    | 'error_deleting'
    | 'error_extending'
    | 'error_restoring'
    | 'extending'
    | 'in-use'
    | 'maintenance'
    | 'reserved'
    | 'restoring-backup'
    | 'retyping'
    | 'uploading';
  tags: string[];
  type:
    | 'classic'
    | 'classic-BETA'
    | 'high-speed'
    | 'high-speed-BETA'
    | 'high-speed-gen2';
  user: string;
  visibility: string;
};

export const getImages = async (projectId: string): Promise<TImage[]> => {
  const { data } = await v6.get<TImage[]>(`/cloud/project/${projectId}/image`);
  return data;
};
