import { apiClient } from '@ovh-ux/manager-core-api';
import { AppData } from '@/data/api';
import ai from '@/types/AI';

export interface DataSyncProps extends AppData {
  dataSyncSpec: Omit<ai.volume.DataSyncSpec, 'manual'>;
}

export const dataSync = async ({
  projectId,
  appId,
  dataSyncSpec,
}: DataSyncProps) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/ai/app/${appId}/datasync`, dataSyncSpec)
    .then((res) => res.data as ai.volume.DataSync);
