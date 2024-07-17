import { user } from '@/types/user';

export const mockedUserCreation: user.UserCreation = {
  description: 'description',
  role: user.AIUserRoleEnum.ai_training_operator,
};

export const mockedUser: user.User = {
  createdDate: new Date(),
  description: 'description',
  id: 'idUser',
  openstackId: 'openStackId',
  roles: [
    {
      description: 'description',
      id: 'idRole',
      name: user.AIUserRoleEnum.ai_training_operator,
      permissions: ['RO'],
    },
  ],
  status: user.UserStatusEnum.OK,
  username: 'username',
  password: 'myPassword'
};
