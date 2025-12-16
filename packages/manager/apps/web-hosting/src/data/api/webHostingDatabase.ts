import { v6 } from '@ovh-ux/manager-core-api';

export type HostingDatabaseDetail = {
  name: string;
  server?: string;
  port?: number;
  user?: string;
  type?: string;
};

export const getHostingDatabases = async (
  serviceName: string,
  type: string = 'mysql',
): Promise<string[]> => {
  const { data } = await v6.get<string[]>(`/hosting/web/${serviceName}/database`, {
    params: { type },
  });
  return data;
};

export const getHostingDatabase = async (
  serviceName: string,
  databaseName: string,
): Promise<HostingDatabaseDetail> => {
  const { data } = await v6.get<HostingDatabaseDetail>(
    `/hosting/web/${serviceName}/database/${databaseName}`,
  );
  return data;
};
