import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';
import { TKube, TNetworkConfiguration } from '@/types';

export const getKubernetesCluster = async (
  projectId: string,
  kubeId: string,
): Promise<TKube> => {
  const { data } = await v6.get<TKube>(
    `/cloud/project/${projectId}/kube/${kubeId}`,
  );
  return data;
};

export const getAllKube = async (projectId: string): Promise<TKube[]> => {
  const { data } = await fetchIcebergV6<TKube>({
    route: `/cloud/project/${projectId}/kube`,
  });
  return data;
};

export interface KubeClusterCreationParams {
  name: string;
  region: string;
  version: string;
  updatePolicy: string;
  nodepool: {
    antiAffinity: boolean;
    autoscale: boolean;
    desiredNodes: number;
    maxNodes?: number;
    minNodes?: number;
    flavorName: string;
    monthlyBilled: boolean;
  };
  privateNetworkId: string;
  nodesSubnetId?: string;
  loadBalancersSubnetId?: string;
  privateNetworkConfiguration: {
    defaultVrackGateway?: string;
    privateNetworkRoutingAsDefault?: boolean;
  };
}

export const createKubernetesCluster = async (
  projectId: string,
  params: KubeClusterCreationParams,
) => {
  const { data } = await v6.post(`/cloud/project/${projectId}/kube`, params);
  return data;
};

export const updateKubernetesCluster = async (
  projectId: string,
  kubeId: string,
  params: Partial<TKube>,
) => {
  const { data } = await v6.put(
    `/cloud/project/${projectId}/kube/${kubeId}`,
    params,
  );
  return data;
};

export const resetKubeConfig = async (projectId: string, kubeId: string) => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/kube/${kubeId}/kubeconfig/reset`,
  );
  return data;
};

export const getClusterRestrictions = async (
  projectId: string,
  kubeId: string,
): Promise<string[]> => {
  const { data } = await v6.get<string[]>(
    `/cloud/project/${projectId}/kube/${kubeId}/ipRestrictions`,
  );
  return data;
};

export type TOidcProvider = {
  issuerUrl: string;
  clientId: string;
  usernameClaim: string;
  usernamePrefix: string;
  groupsClaim: string | null;
  groupsPrefix: string;
  signingAlgorithms: string | null;
  caContent: string;
  requiredClaim: string | null;
};

export const getOidcProvider = async (
  projectId: string,
  kubeId: string,
): Promise<TOidcProvider> => {
  const { data } = await v6.get<TOidcProvider>(
    `/cloud/project/${projectId}/kube/${kubeId}/openIdConnect`,
  );
  return data;
};

export const postKubeConfig = async (
  projectId: string,
  kubeId: string,
): Promise<{ content: string }> => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/kube/${kubeId}/kubeconfig`,
  );

  return data;
};

export const updateKubePolicy = async (
  projectId: string,
  kubeId: string,
  updatePolicy: string,
) => {
  const { data } = await v6.put(
    `/cloud/project/${projectId}/kube/${kubeId}/updatePolicy`,
    {
      updatePolicy,
    },
  );
  return data;
};

export const updateKubeVersion = async (
  projectId: string,
  kubeId: string,
  strategy: string,
) => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/kube/${kubeId}/update`,
    {
      strategy,
    },
  );
  return data;
};

export const terminateCluster = async (projectId: string, kubeId: string) => {
  const { data } = await v6.delete(
    `/cloud/project/${projectId}/kube/${kubeId}`,
  );
  return data;
};

export type TResetClusterParams = {
  loadBalancersSubnetId: string;
  nodesSubnetId: string;
  privateNetworkConfiguration?: TNetworkConfiguration;
  privateNetworkId: string;
  version: string;
  workerNodesPolicy: string;
};

export const resetCluster = async (
  projectId: string,
  kubeId: string,
  params: TResetClusterParams,
) => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/kube/${kubeId}/reset`,
    params,
  );
  return data;
};

export const addOidcProvider = async (
  projectId: string,
  kubeId: string,
  params: TOidcProvider,
) => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/kube/${kubeId}/openIdConnect`,
    params,
  );
  return data;
};

export const updateOidcProvider = async (
  projectId: string,
  kubeId: string,
  params: TOidcProvider,
) => {
  const { data } = await v6.put(
    `/cloud/project/${projectId}/kube/${kubeId}/openIdConnect`,
    params,
  );
  return data;
};

export const removeOidcProvider = async (projectId: string, kubeId: string) => {
  const { data } = await v6.delete(
    `/cloud/project/${projectId}/kube/${kubeId}/openIdConnect`,
  );
  return data;
};

export type TSubscription = {
  createdAt: string;
  king: string;
  resource: {
    name: string;
    type: string;
  };
  serviceName: string;
  streamId: string;
  subscriptionId: string;
  updatedAt: string;
};

export const getSubscribedLogs = async (
  projectId: string,
  kubeId: string,
  kind: string,
) => {
  const { data } = await fetchIcebergV6<TSubscription>({
    route: `/cloud/project/${projectId}/kube/${kubeId}/log/subscription?kind=${kind}`,
    disableCache: true,
  });
  return data;
};

export type TLogURL = {
  expirationDate: string;
  url: string;
};

export const postLogURL = async (
  projectId: string,
  kubeId: string,
  kind: string,
) => {
  const { data } = await v6.post<TLogURL>(
    `/cloud/project/${projectId}/kube/${kubeId}/log/url`,
    {
      kind,
    },
  );
  return data;
};

export type TSubscriptionOperation = {
  operationId: string;
  serviceName: string;
};

export const pollOperation = async (
  serviceName: string,
  operationId: string,
  intervalMs = 1000,
) => {
  const poll = async () => {
    const { data: op } = await v6.get(
      `/dbaas/logs/${serviceName}/operation/${operationId}`,
    );
    if (op.state === 'SUCCESS') {
      return op;
    }
    if (op.state === 'ERROR') {
      throw new Error(op);
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    return poll();
  };
  return poll();
};

export async function createSubscription(
  projectId: string,
  kubeId: string,
  streamId: string,
  kind = 'audit',
) {
  const { data: operation } = await v6.post<TSubscriptionOperation>(
    `/cloud/project/${projectId}/kube/${kubeId}/log/subscription`,
    {
      kind,
      streamId,
    },
  );
  return pollOperation(operation.serviceName, operation.operationId);
}

export async function deleteSubscription(
  projectId: string,
  kubeId: string,
  subscriptionId: string,
) {
  const { data: operation } = await v6.delete<TSubscriptionOperation>(
    `/cloud/project/${projectId}/kube/${kubeId}/log/subscription/${subscriptionId}`,
  );
  return pollOperation(operation.serviceName, operation.operationId);
}

export async function editNetwork(
  projectId: string,
  kubeId: string,
  hasLoadBalancersChanges: boolean,
  loadBalancersSubnetId: string,
  privateNetworkConfiguration?: {
    privateNetworkRoutingAsDefault: boolean;
    defaultVrackGateway: string;
  },
) {
  const todo = [];
  if (privateNetworkConfiguration) {
    todo.push(
      v6.put(
        `/cloud/project/${projectId}/kube/${kubeId}/privateNetworkConfiguration`,
        privateNetworkConfiguration,
      ),
    );
  }
  if (hasLoadBalancersChanges) {
    todo.push(
      v6.put(
        `/cloud/project/${projectId}/kube/${kubeId}/updateLoadBalancersSubnetId`,
        { loadBalancersSubnetId },
      ),
    );
  }
  return Promise.all(todo);
}
