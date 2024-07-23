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
