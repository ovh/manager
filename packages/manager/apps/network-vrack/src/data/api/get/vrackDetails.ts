import { v6 } from '@ovh-ux/manager-core-api';

export interface Vrack {
  description: string;
  iam: {
    displayName: string;
    id: string;
    state: 'EXPIRED' | 'IN_CREATION' | 'OK' | 'SUSPENDED';
    tags: {
      [key: string]: string;
    };
    urn: string;
  };
  name: string;
  serviceName: string;
}

export const getVrackDetail = async (serviceName: string): Promise<Vrack> => {
  const { data } = await v6.get<Vrack>(`/vrack/${serviceName}`);
  return data;
};
