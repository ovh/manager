import { Handler } from '../../../../../super-components/_common/msw-helpers';
import { Task } from '../../src/api/api.type';

export type GetTaskMocksParams = {
  taskId?: string;
};

export const getTaskMocks = ({
  taskId = '',
}: GetTaskMocksParams): Handler[] => [
  {
    url: '/vrackServices/resource/:id/task',
    response: [{ id: taskId }] as Task[],
    api: 'v6',
  },
];
