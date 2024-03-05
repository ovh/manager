import { user } from "@/models/types";
import { usage } from "@/models/usage";
import { apiClient } from "@ovh-ux/manager-core-api";

export const cloudApi = {
    getCurrentUsage: async (projectId: string) => apiClient.v6.get(
        `/cloud/project/${projectId}/usage/current`,
    ).then(res => res.data as usage.UsageCurrent)
    ,
    getSSHKey: async (projectId: string, regionId: string) => apiClient.v6.get(
        `/cloud/project/${projectId}/region/${regionId}/sshkey`,
    ).then(res => res.data as user.SSHKey[])
    ,
    getRegions: async (projectId: string) => apiClient.v6.get(
        `/cloud/project/${projectId}/region`,
    ).then(res => res.data as string[])
    ,

}