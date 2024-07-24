import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';
import { TKube } from '@/types';

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
