import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { PublicVcda, PublicVcdaTargetSpec } from '../types/vcda-migration.type';

export const VCDA_MIGRATION_ROUTE = '/vmwareCloudDirector/migration';

export const getVcdaMigrationList = async (): Promise<PublicVcda[]> => {
  const { data } = await apiClient.v2.get<PublicVcda[]>(VCDA_MIGRATION_ROUTE);
  return data;
};

export const getVcdaMigration = async (
  migrationId: string,
): Promise<PublicVcda> => {
  const { data } = await apiClient.v2.get<PublicVcda>(
    `${VCDA_MIGRATION_ROUTE}/${migrationId}`,
  );
  return data;
};

export const updateVcdaMigrationWhitelist = (
  migrationId: string,
  targetSpec: PublicVcdaTargetSpec,
): Promise<ApiResponse<PublicVcda>> =>
  apiClient.v2.put(`${VCDA_MIGRATION_ROUTE}/${migrationId}`, { targetSpec });
