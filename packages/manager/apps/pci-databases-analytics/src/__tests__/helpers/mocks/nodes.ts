import * as database from '@/types/cloud/project/database';

export const mockedNode: database.service.Node = {
  createdAt: 'createdAt',
  flavor: 'flavor',
  id: 'nodeId',
  name: 'nodeName',
  port: 8080,
  region: 'region',
  role: database.service.node.RoleEnum.ANALYTICS,
  status: database.StatusEnum.CREATING,
};
