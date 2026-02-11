import { v6 } from '@ovh-ux/manager-core-api';

export interface VrackUpdate {
  description: string;
  name: string;
}

export const putVrackDetail = async (
  serviceName: string,
  vrackDetail: VrackUpdate,
): Promise<void> => {
  await v6.put<VrackUpdate>(`/vrack/${serviceName}`, vrackDetail);
};
