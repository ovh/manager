import { apiClient } from '@ovh-ux/manager-core-api';
import { TTrackingData } from '@/types';

export const getOperationTrackingStatus = async (
  id: number,
): Promise<TTrackingData> =>
  apiClient.v6.get(`/me/task/domain/${id}/progressbar`);
