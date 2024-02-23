import { apiClient } from "@ovh-ux/manager-core-api";
import { ai, user } from "@/models/types";

export interface NotebookProps {
    projectId: string,
    notebookId: string,
};

export interface JobProps {
    projectId: string,
    jobId: string,
};

export interface AppProps {
    projectId: string,
    appId: string,
};

export interface DataSyncProps {
    projectId: string,
    productId: string,
    dataSyncSpec?: {
        direction: string,
    },
};

export interface LabelsProps {
    projectId: string,
    notebookId: string,
    notebookSpec: {
        labels: Record<string, string>,
    },
};

export interface LabelsJobProps {
    projectId: string,
    jobId: string,
    labels: Record<string, string>,
};

export interface LabelsAppProps {
    projectId: string,
    appId: string,
    labels: Record<string, string>,
};

export interface OrderNbProps {
    projectId: string,
    notebookSpec: {
        env: {
            editorId: string,
            frameworkId: string,
            frameworkVersion?: string,
        },
        name?: string,
        region: string,
        unsecureHttp: boolean,
        resources: {
            flavor: string,
            cpu?: number,
            gpu?: number,
        },
    };
};

export interface DockerImageProps {
    projectId: string,
    appId: string,
    imageSpec: {
        url: string,
    },
};

export interface HttpPortProps {
    projectId: string,
    appId: string,
    httpPortSpec: {
        defaultHttpPort: number,
    },
};

export interface ScalingStrategyProps {
    projectId: string,
    appId: string,
    scalingStrategyInput: ai.app.ScalingStrategy
};

export interface UserCreationProps {
    projectId: string,
    userInput: {
        description: string,
        role: string,
    }
};

export interface RegistryCreationProps {
    projectId: string,
    registryInput: {
        region: string,
        username: string,
        password: string,
        url: string,
    }
};

export interface TokenGenerationProps {
    projectId: string,
    tokenInput: {
        name: string,
        labelSelector?: string,
        role: string,
        region: string,
    }
}

export interface TokenProps {
    projectId: string,
    tokenId: string,
}

export interface RegistryProps {
    projectId: string,
    registryId: string,
}

export const aiApi = {
    getRegions: async (projectId: string) => apiClient.v6.get(
        `/cloud/project/${projectId}/ai/capabilities/region`,
    ).then(res => res.data as ai.capabilities.Region[])
    ,
    getFlavors: async (projectId: string, region: string) => apiClient.v6.get(
        `/cloud/project/${projectId}/ai/capabilities/region/${region}/flavor`,
    ).then(res => res.data as ai.capabilities.Flavor[])
    ,
    getTokens: async (projectId: string) => apiClient.v6.get(
        `/cloud/project/${projectId}/ai/token`,
    ).then(res => res.data as ai.token.Token[])
    ,
    getUsers: async (projectId: string) => apiClient.v6.get(
        `/cloud/project/${projectId}/user`,
    ).then(res => res.data as user.User[])
    ,
    addUser: async ({
        projectId,
        userInput,
    }: UserCreationProps
    ) => 
        await apiClient.v6.post(
            `/cloud/project/${projectId}/user`,
            userInput,
        )
            .then((res) => res.data as user.User)
    ,
    generateToken: async ({
        projectId,
        tokenInput,
    }: TokenGenerationProps
    ) => 
        await apiClient.v6.post(
            `/cloud/project/${projectId}/ai/token`,
            tokenInput,
        )
            .then((res) => res.data as ai.token.Token)
    ,
    regenerateToken: async ({
        projectId,
        tokenId,
    }: TokenProps
    ) => 
        await apiClient.v6.post(
            `/cloud/project/${projectId}/ai/token/${tokenId}/renew`,
        )
            .then((res) => res.data as ai.token.Token)
    ,
    deleteToken: async ({
        projectId,
        tokenId,
    }: TokenProps
    ) => {
        await apiClient.v6.delete(
            `/cloud/project/${projectId}/ai/token/${tokenId}`,
        )
    },
    getRegistries: async (projectId: string) => apiClient.v6.get(
        `/cloud/project/${projectId}/ai/registry`,
    ).then(res => res.data as ai.registry.Registry[])
    ,
    deleteRegistry: async ({
        projectId,
        registryId,
    }: RegistryProps
    ) => {
        await apiClient.v6.delete(
            `/cloud/project/${projectId}/ai/registry/${registryId}`,
        )
    },
    addRegistry: async ({
        projectId,
        registryInput,
    }: RegistryCreationProps
    ) => 
        await apiClient.v6.post(
            `/cloud/project/${projectId}/ai/registry`,
            registryInput,
        )
            .then((res) => res.data as string)
    ,
};

export const notebookApi = {
    getNotebooks: async (projectId: string) =>
        apiClient.v6.get(
            `/cloud/project/${projectId}/ai/notebook`,
            {
                headers: {
                    'X-Pagination-Mode': 'CachedObjectList-Pages',
                    'X-Pagination-Size': '50000',
                    'Pragma': 'no-cache'
                },
            },
        ).then(res => res.data as ai.notebook.Notebook[])
    ,
    getNotebook: async (projectId: string, notebookId: string) =>
        apiClient.v6.get(
            `/cloud/project/${projectId}/ai/notebook/${notebookId}`,
            {
                headers: {
                    'Pragma': 'no-cache'
                },
            },
        ).then(res => res.data as ai.notebook.Notebook)
    ,
    getNbCapaEditors: async (projectId: string) => apiClient.v6.get(
        `/cloud/project/${projectId}/ai/notebook/capabilities/editor`,
    ).then(res => res.data as ai.notebook.Editor[])
    ,
    getNbCapaFrameworks: async (projectId: string) => apiClient.v6.get(
        `/cloud/project/${projectId}/ai/notebook/capabilities/framework`,
    ).then(res => res.data as ai.notebook.Framework[])
    ,
    deleteNotebook: async ({
        projectId,
        notebookId,
    }: NotebookProps
    ) => {
        await apiClient.v6.delete(
            `/cloud/project/${projectId}/ai/notebook/${notebookId}`,
        )
    },
    stopNotebook: async ({
        projectId,
        notebookId,
    }: NotebookProps
    ) => {
        await apiClient.v6.put(
            `/cloud/project/${projectId}/ai/notebook/${notebookId}/stop`,
        )
    },
    startNotebook: async ({
        projectId,
        notebookId,
    }: NotebookProps
    ) => {
        await apiClient.v6.put(
            `/cloud/project/${projectId}/ai/notebook/${notebookId}/start`,
        )
    },
    manualDataSync: async ({
        projectId,
        productId,
        dataSyncSpec,
    }: DataSyncProps
    ) => 
        await apiClient.v6.post(
            `/cloud/project/${projectId}/ai/notebook/${productId}/datasync`,
            dataSyncSpec,
        )
            .then((res) => res.data as string)
    ,
    orderNotebook: async ({
        projectId,
        notebookSpec,
    }: OrderNbProps
    ) => 
        await apiClient.v6.post(
            `/cloud/project/${projectId}/ai/notebook/`,
            notebookSpec,
        )
            .then((res) => res.data as string)
    ,
    updateNotebook: async ({
        projectId,
        notebookId,
        notebookSpec,
    }: LabelsProps
    ) => 
        await apiClient.v6.put(
            `/cloud/project/${projectId}/ai/notebook/${notebookId}`,
            notebookSpec,
        )
            .then((res) => res.data as string)
    
};

export const jobsApi = {
    getJobs: async (projectId: string) =>
        apiClient.v6.get(
            `/cloud/project/${projectId}/ai/job`,
            {
                headers: {
                    'X-Pagination-Mode': 'CachedObjectList-Pages',
                    'X-Pagination-Size': '50000',
                    'Pragma': 'no-cache'
                },
            },
        ).then(res => res.data as ai.job.Job[])
    ,
    getJob: async (projectId: string, jobId: string) =>
        apiClient.v6.get(
            `/cloud/project/${projectId}/ai/job/${jobId}`,
            {
                headers: {
                    'Pragma': 'no-cache'
                },
            },
        ).then(res => res.data as ai.job.Job)
    ,
    deleteJob: async ({
        projectId,
        jobId,
    }: JobProps
    ) => {
        await apiClient.v6.delete(
            `/cloud/project/${projectId}/ai/job/${jobId}`,
        )
    },
    stopJob: async ({
        projectId,
        jobId,
    }: JobProps
    ) => {
        await apiClient.v6.put(
            `/cloud/project/${projectId}/ai/job/${jobId}/stop`,
        )
    },
    startJob: async ({
        projectId,
        jobId,
    }: JobProps
    ) => {
        await apiClient.v6.put(
            `/cloud/project/${projectId}/ai/job/${jobId}/start`,
        )
    },
    manualDataSync: async ({
        projectId,
        productId,
        dataSyncSpec,
    }: DataSyncProps
    ) => 
        await apiClient.v6.post(
            `/cloud/project/${projectId}/ai/job/${productId}/datasync`,
            dataSyncSpec,
        )
            .then((res) => res.data as string)
    ,
    getLogs: async (projectId: string, jobId: string) =>
        apiClient.v6.get(
            `/cloud/project/${projectId}/ai/job/${jobId}/log`,
            {
                headers: {
                    'Pragma': 'no-cache',
                },
            },
        ).then(res => res.data as ai.Logs)
    ,
    updateLabel: async ({ projectId, jobId, labels }: LabelsJobProps) => 
        await apiClient.v6.put(
            `/cloud/project/${projectId}/ai/job/${jobId}/label`,
            labels,
        )
            .then((res) => res.data as string)
    ,
};

export const appsApi = {
    getApps: async (projectId: string) =>
        apiClient.v6.get(
            `/cloud/project/${projectId}/ai/app`,
            {
                headers: {
                    'X-Pagination-Mode': 'CachedObjectList-Pages',
                    'X-Pagination-Size': '50000',
                    'Pragma': 'no-cache'
                },
            },
        ).then(res => res.data as ai.app.App[])
    ,
    getApp: async (projectId: string, appId: string) =>
        apiClient.v6.get(
            `/cloud/project/${projectId}/ai/app/${appId}`,
            {
                headers: {
                    'Pragma': 'no-cache'
                },
            },
        ).then(res => res.data as ai.app.App)
    ,
    deleteApp: async ({
        projectId,
        appId,
    }: AppProps
    ) => {
        await apiClient.v6.delete(
            `/cloud/project/${projectId}/ai/app/${appId}`,
        )
    },
    stopApp: async ({
        projectId,
        appId,
    }: AppProps
    ) => {
        await apiClient.v6.put(
            `/cloud/project/${projectId}/ai/app/${appId}/stop`,
        )
    },
    startApp: async ({
        projectId,
        appId,
    }: AppProps
    ) => {
        await apiClient.v6.put(
            `/cloud/project/${projectId}/ai/app/${appId}/start`,
        )
    },
    manualDataSync: async ({
        projectId,
        productId,
        dataSyncSpec,
    }: DataSyncProps
    ) => 
        await apiClient.v6.post(
            `/cloud/project/${projectId}/ai/app/${productId}/datasync`,
            dataSyncSpec,
        )
            .then((res) => res.data as string)
    ,
    updateLabel: async ({ projectId, appId, labels }: LabelsAppProps) => 
        await apiClient.v6.put(
            `/cloud/project/${projectId}/ai/app/${appId}/label`,
            labels,
        )
            .then((res) => res.data as string)
    ,
    updateDockerImage: async ({ projectId, appId, imageSpec }: DockerImageProps) => 
        await apiClient.v6.put(
            `/cloud/project/${projectId}/ai/app/${appId}/image`,
            imageSpec,
        )
            .then((res) => res.data as string)
    ,
    updateHttpPortApp: async ({
        projectId,
        appId,
        httpPortSpec,
    }: HttpPortProps
    ) => 
        await apiClient.v6.put(
            `/cloud/project/${projectId}/ai/app/${appId}`,
            httpPortSpec,
        )
            .then((res) => res.data as string)
    ,
    updateScalingStrategy: async ({
        projectId,
        appId,
        scalingStrategyInput,
    }: ScalingStrategyProps
    ) => 
        await apiClient.v6.put(
            `/cloud/project/${projectId}/ai/app/${appId}/scalingstrategy`,
            scalingStrategyInput,
        )
            .then((res) => res.data as string)
}

