import * as user from '@/types/cloud/user';
import * as ai from '@/types/cloud/project/ai';

export const mockedUserDetails: user.UserDetail = {
  creationDate: '1989/04/08',
  description: 'description',
  id: 25,
  openstackId: 'openStackId',
  roles: [
    {
      description: 'description',
      id: 'idRole',
      name: 'roleName',
      permissions: ['RO'],
    },
  ],
  status: user.UserStatusEnum.ok,
  username: 'username',
  password: 'password',
};

export const mockedUser: user.User = {
  creationDate: '1989/04/08',
  description: 'description',
  id: 25,
  openstackId: 'openStackId',
  roles: [
    {
      description: 'description',
      id: 'idRole',
      name: 'roleName',
      permissions: ['RO'],
    },
  ],
  status: user.UserStatusEnum.ok,
  username: 'username',
};

export const mockedUserCreation = {
  description: 'description',
  role: ai.TokenRoleEnum.ai_training_operator,
};
