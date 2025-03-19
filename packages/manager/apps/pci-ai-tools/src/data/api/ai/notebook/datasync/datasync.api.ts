import { apiClient } from '@ovh-ux/manager-core-api';
import ai from '@/types/AI';
import { NotebookData } from '@/data/api';

export interface DataSyncProps extends NotebookData {
  dataSyncSpec: ai.volume.DataSyncSpec;
}

export const dataSync = async ({
  projectId,
  notebookId,
  dataSyncSpec,
}: DataSyncProps) =>
  apiClient.v6
    .post(
      `/cloud/project/${projectId}/ai/notebook/${notebookId}/datasync`,
      dataSyncSpec,
    )
    .then((res) => res.data as ai.volume.DataSync);
