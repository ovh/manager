import { apiClient } from '@ovh-ux/manager-core-api';

export const getVrackIpListQueryKey = (vrackId: string) => [
  'vrack',
  vrackId,
  'ip',
];

export const getVrackIpList = (vrackId: string) =>
  apiClient.v6.get<string[]>(`/vrack/${vrackId}/ip`);
