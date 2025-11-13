import { TaskDetailsType } from '../types/product/webHosting';
import { OngoingTaskStatus } from '../types/status';

export const tasksMocks: TaskDetailsType[] = [
  {
    id: 'a47dd264-a9ac-41bc-99b7-54b879afc54a',
    status: OngoingTaskStatus.DOING,
    function: 'attachedDomain/create',
    objectId: '30533272',
    startDate: '2025-08-19T12:39:25.208307Z',
    doneDate: '2025-08-19T12:39:25.208307Z',
    lastUpdate: '2025-08-19T12:39:26.280242Z',
    objectType: 'AttachedDomain',
  },
  {
    id: 'a47dd264-a9ac-41bc-99b7-54b879afc54a',
    status: OngoingTaskStatus.DOING,
    doneDate: null,
    function: 'attachedDomain/create',
    objectId: '30533271',
    startDate: '2025-08-19T12:39:25.192758Z',
    lastUpdate: '2025-08-19T12:39:26.381984Z',
    objectType: 'AttachedDomain',
  },
];
