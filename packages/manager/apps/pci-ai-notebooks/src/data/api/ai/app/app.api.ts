import { apiClient } from '@ovh-ux/manager-core-api';
import * as ai from '@/types/cloud/project/ai';
import { PCIAi } from '../..';

export const getApps = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/app`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '50000',
        Pragma: 'no-cache',
      },
    })
    .then((res) => res.data as ai.app.App[]);

export interface AddApp extends PCIAi {
  appInfo: ai.app.AppSpecInput;
}

export const addApp = async ({ projectId, appInfo }: AddApp) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/ai/app`, appInfo)
    .then((res) => res.data as ai.app.App);

export const getCommand = async ({ projectId, appInfo }: AddApp) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/ai/app/command`, appInfo)
    .then((res) => res.data as ai.Command);
