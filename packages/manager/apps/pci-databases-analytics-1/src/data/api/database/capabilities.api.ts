import { apiClient } from '@ovh-ux/manager-core-api';
import * as database from '@/types/cloud/project/database';

export const getCapabilities = async (projectId: string) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/database/capabilities`)
    .then((res) => res.data as database.Capabilities);

export const getEnginesCapabilities = async (projectId: string) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/database/capabilities/engines`)
    .then((res) => res.data as database.capabilities.EngineCapabilities[]);

export const getRegionsCapabilities = async (projectId: string) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/database/capabilities/regions`)
    .then((res) => res.data as database.capabilities.RegionCapabilities[]);
