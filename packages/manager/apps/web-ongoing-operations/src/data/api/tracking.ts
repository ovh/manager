import { apiClient } from '@ovh-ux/manager-core-api';
import { TTracking } from '@/types';

export const getOperationTrackingStatus = async (
  id: number,
): Promise<TTracking> =>
  apiClient.v6.get(`/me/task/domain/${id}/progressbar`).then((res) => res.data);
