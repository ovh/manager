import { apiClient } from "@ovh-ux/manager-core-api";

export const getOperationTrackingStatus = async (id: number): Promise<any> => {
  apiClient.v6.get(`/me/task/domain/${id}/progressbar`);
}
