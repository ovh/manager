import apiClient from '@/api/client';

export type Vrack = {
  serviceName?: string;
  description: string;
  name: string;
};

export async function getVrack(serviceName: string): Promise<Vrack> {
  const { data } = await apiClient.v6.get(`/vrack/${serviceName}`);
  return {
    serviceName,
    ...data,
  };
}

export default Vrack;
