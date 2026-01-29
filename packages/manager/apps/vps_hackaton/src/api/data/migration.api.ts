import { v6 } from '@ovh-ux/manager-core-api';
import type { TTask } from '@/domain/entities/task';

export type TMigrationEligibility = {
  eligible: boolean;
  reason?: string;
  targetOffer?: string;
};

export type TMigrationRequest = {
  serviceName: string;
  scheduledDate?: string;
};

export const checkMigrationEligibility = async (
  serviceName: string,
): Promise<TMigrationEligibility> => {
  try {
    const { data } = await v6.get<TMigrationEligibility>(
      `/vps/${serviceName}/migration/2025`,
    );
    return data;
  } catch (error) {
    return { eligible: false, reason: 'Not eligible' };
  }
};

export const requestMigration = async (
  params: TMigrationRequest,
): Promise<TTask> => {
  const { data } = await v6.post<TTask>(
    `/vps/${params.serviceName}/migration/2025`,
    {
      scheduledDate: params.scheduledDate,
    },
  );
  return data;
};

export const cancelMigration = async (serviceName: string): Promise<void> => {
  await v6.delete(`/vps/${serviceName}/migration/2025`);
};
