import { apiClient } from '@ovh-ux/manager-core-api';
import ai from '@/types/AI';
import { AppData, PCIAi } from '../..';

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

export const getApp = async ({ projectId, appId }: AppData) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/app/${appId}`)
    .then((res) => res.data as ai.app.App);

export interface AddApp extends PCIAi {
  appInfo: ai.app.AppSpecInput;
}

export interface UpdateApp extends AppData {
  appInfo: ai.app.UpdateInput;
}

export const addApp = async ({ projectId, appInfo }: AddApp) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/ai/app`, appInfo)
    .then((res) => res.data as ai.app.App);

export const updateApp = async ({ projectId, appId, appInfo }: UpdateApp) => {
  return apiClient.v6
    .put(`/cloud/project/${projectId}/ai/app/${appId}`, appInfo)
    .then((res) => res.data as ai.app.App);
};

export const getCommand = async ({ projectId, appInfo }: AddApp) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/ai/app/command`, appInfo)
    .then((res) => res.data as ai.Command);

export const startApp = async ({ projectId, appId }: AppData) => {
  return apiClient.v6
    .put(`/cloud/project/${projectId}/ai/app/${appId}/start`)
    .then((res) => res.data as ai.app.App);
};
export const stopApp = async ({ projectId, appId }: AppData) => {
  return apiClient.v6
    .put(`/cloud/project/${projectId}/ai/app/${appId}/stop`)
    .then((res) => res.data as ai.app.App);
};

export const deleteApp = async ({ projectId, appId }: AppData) =>
  apiClient.v6.delete(`/cloud/project/${projectId}/ai/app/${appId}`);
