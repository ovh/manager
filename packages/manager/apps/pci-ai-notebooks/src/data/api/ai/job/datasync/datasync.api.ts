import { apiClient } from '@ovh-ux/manager-core-api';
import { JobData } from '@/data/api';
import * as ai from '@/types/cloud/project/ai';

export interface DataSyncProps extends JobData {
  dataSyncSpec: ai.volume.DataSyncSpec;
}

export const dataSync = async ({
  projectId,
  jobId,
  dataSyncSpec,
}: DataSyncProps) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/ai/job/${jobId}/datasync`, dataSyncSpec)
    .then((res) => res.data as ai.volume.DataSync);
