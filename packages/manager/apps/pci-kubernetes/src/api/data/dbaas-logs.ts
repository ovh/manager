import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';

export type TDbaasLog = {
  createdAt: string;
  displayName?: string;
  iam?: {
    displayName?: string;
    id: string;
    tags?: Record<string, string>;
    urn: string;
  };
  isClusterOwner: boolean;
  plan: 'ENTERPRISE' | 'STANDARD';
  serviceName: string;
  state: 'DISABLED' | 'ENABLED' | 'INIT' | 'TO_CONFIG';
  updatedAt?: string;
  username: string;
};

export async function getLogs() {
  const { data } = await fetchIcebergV6<TDbaasLog>({
    route: `/dbaas/logs`,
  });
  return data;
}

export type TDbaasStream = {
  canAlert: boolean;
  clusterId: string;
  createdAt: string;
  description: string;
  isEditable: boolean;
  title: string;
  updatedAt: string;
  retentionId: string;
  streamId: string;
};

export async function getStream(serviceName: string, streamId: string) {
  const { data } = await v6.get<TDbaasStream>(
    `/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}`,
  );
  return data;
}

export async function getStreams(serviceName: string) {
  const { data } = await v6.get<TDbaasStream>(
    `/dbaas/logs/${serviceName}/output/graylog/stream`,
  );
  return data;
}

export type TStreamURL = {
  address: string;
  type: string;
};

export async function getStreamURL(serviceName: string, streamId: string) {
  const { data } = await v6.get<TStreamURL[]>(
    `/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}/url`,
  );
  return data;
}
