import { apiClient } from '@ovh-ux/manager-core-api';
import user from '@/types/User';
import { PCIAi } from '..';

export const getUsers = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/user`)
    .then((res) => res.data as user.User[]);

export interface AddUserProps extends PCIAi {
  newUser: {
    description: string;
    role: user.RoleEnum;
  };
}
export const addUser = async ({ projectId, newUser }: AddUserProps) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/user`, newUser)
    .then((res) => res.data as user.UserDetail);
