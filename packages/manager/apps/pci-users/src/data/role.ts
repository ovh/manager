import { v6 } from '@ovh-ux/manager-core-api';
import { Role, Service } from '@/interface';

export type GetAllRoleResponse = {
  roles: Role[];
  services: Service[];
};

export const getAllRoles = async (
  projectId: string,
): Promise<GetAllRoleResponse> => {
  const { data } = await v6.get(`/cloud/project/${projectId}/role`);

  return data;
};
