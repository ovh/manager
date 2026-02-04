import { Handler } from '@ovh-ux/manager-core-test-utils';

export type GetVrackTaskMocksParam = {
  withOnGoingDeleteTask?: boolean;
};

export const vrackTaskMocks = [
  {
    function: 'removeBlockFromBridgeDomain',
    id: 12345,
    lastUpdate: '2026-02-05T15:28:51.066Z',
    orderId: 0,
    serviceName: 'pn-00001',
    status: 'todo',
    targetDomain: '5.39.12.96/28',
    todoDate: '2026-02-05T15:28:51.066Z',
  },
];

export const getVrackTaskMocks = (mocksParam: GetVrackTaskMocksParam): Handler[] => [
  {
    url: '/vrack/:serviceName/task',
    response: () => {
      return mocksParam.withOnGoingDeleteTask ? vrackTaskMocks.map(({ id }) => id) : [];
    },
    status: 200,
    method: 'get',
    api: 'v6',
  },
  {
    url: '/vrack/:serviceName/task/:taskId',
    response: () => {
      return mocksParam.withOnGoingDeleteTask ? vrackTaskMocks[0] : undefined;
    },
    status: mocksParam.withOnGoingDeleteTask ? 200 : 404,
    method: 'get',
    api: 'v6',
  },
];
