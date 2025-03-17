import { v6 } from '@ovh-ux/manager-core-api';

export interface TSnapshot {
  id: string;
  creationDate: string;
  name: string;
  description: string;
  size: number;
  volumeId: string;
  region: string;
  status: 'available' | 'creating' | 'deleting' | 'error' | 'error_deleting';
  planCode: string | null;
}

export interface TVolume {
  id: string;
  attachedTo: string[];
  creationDate: string;
  name: string;
  description: string;
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
  region: string;
  bootable: boolean;
  planCode: string | null;
  availabilityZone: string | null;
  type:
    | 'classic'
    | 'classic-BETA'
    | 'high-speed'
    | 'high-speed-BETA'
    | 'high-speed-gen2';
}

export const getSnapshots = async (projectId: string): Promise<TSnapshot[]> => {
  const { data } = await v6.get(`/cloud/project/${projectId}/volume/snapshot`);
  return data;
};

export const getVolume = async (
  projectId: string,
  snapshotId: string,
): Promise<TVolume> => {
  const { data } = await v6.get(
    `/cloud/project/${projectId}/volume/${snapshotId}`,
  );
  return data;
};
