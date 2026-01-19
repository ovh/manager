import { apiClient } from '@ovh-ux/manager-core-api';

export const getDSVrackQueryKey = (serverName: string) => [
  `get/vrack/server:${encodeURIComponent(JSON.stringify(serverName))}`,
];

export const getDSVrack = async (serviceName: string): Promise<string[]> =>
  (await apiClient.v6.get<string[]>(`/dedicated/server/${serviceName}/vrack`))
    .data;
