import { apiClient } from "@ovh-ux/manager-core-api";

export const getOperationTrackingStatus = async (id: string): Promise<any> => {
  return apiClient.v6.get(`/me/task/domain/${id}/progressbar`);
};
