import { createContext } from 'react';

import { TrackedTask } from '@/types/Task.type';

export type VrackTasksContext = {
  trackedTasks: TrackedTask[];
  trackTask: (newTrackedTask: TrackedTask) => void;
};

const vrackTasksContext = createContext<VrackTasksContext | undefined>(undefined);

export default vrackTasksContext;
