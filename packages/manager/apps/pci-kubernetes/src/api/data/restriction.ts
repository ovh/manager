import { v6 } from '@ovh-ux/manager-core-api';

export const deleteRestriction = async (
  projectId: string,
  kubeId: string,
  ip: string,
): Promise<void> => {
  const { data } = await v6.delete(
    `/cloud/project/${projectId}/kube/${kubeId}/ipRestrictions/${ip}`,
  );
  return data;
};

export const updateRestriction = async (
  projectId: string,
  kubeId: string,
  ips: string[],
): Promise<void> => {
  const { data } = await v6.put(`/cloud/project/${projectId}/kube/${kubeId}/ipRestrictions`, {
    ips,
  });
  return data;
};
