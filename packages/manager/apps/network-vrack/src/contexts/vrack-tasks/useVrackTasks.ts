import { useContext } from 'react';

import vrackTasksContext, { VrackTasksContext } from './vrack-tasks.context';

export const useVrackTasksContext = (): VrackTasksContext => {
  const context = useContext(vrackTasksContext);
  if (context === undefined) {
    throw new Error('useTasksContext must be used within a TasksProvider');
  }
  return context;
};
