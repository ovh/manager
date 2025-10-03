import { apiClient } from '@/data/api/api.client';
import * as database from '@/types/cloud/project/database';

export const getCapabilities = async (projectId: string) =>
  apiClient.v6.get<database.Capabilities>(
    `/cloud/project/${projectId}/database/capabilities`,
  );

export const getEnginesCapabilities = async (projectId: string) =>
  apiClient.v6.get<database.capabilities.EngineCapabilities[]>(
    `/cloud/project/${projectId}/database/capabilities/engines`,
  );

export const getRegionsCapabilities = async (projectId: string) =>
  apiClient.v6.get<database.capabilities.RegionCapabilities[]>(
    `/cloud/project/${projectId}/database/capabilities/regions`,
  );
