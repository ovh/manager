import apiClient from '@/api/client';

export async function getSshKeys(): Promise<string[]> {
  const { data } = await apiClient.v6.get(`/me/sshKey`);
  return data;
}

export default { getSshKeys };
