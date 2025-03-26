import { v6 } from '@ovh-ux/manager-core-api';
import { TVolume } from '@/api/api.types';

export type TNewVolumeData = Partial<TVolume> & { snapshotId?: string };

export async function createVolume(
  projectId: string,
  newVolumeData: TNewVolumeData,
): Promise<TVolume> {
  const { data } = await v6.post<TVolume>(
    `/cloud/project/${projectId}/volume`,
    newVolumeData,
  );
  return data;
}
