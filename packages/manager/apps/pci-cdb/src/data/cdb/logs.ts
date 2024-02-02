import { database } from "@/models/database";
import { apiClient } from "@ovh-ux/manager-core-api";

export const getServiceLogs = async (projectId: string, engine: database.EngineEnum, serviceId: string) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/database/${engine}/${serviceId}/logs`)
    .then((res) => res.data as database.service.LogEntry[]);