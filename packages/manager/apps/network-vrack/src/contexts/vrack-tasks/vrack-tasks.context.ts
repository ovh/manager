import { createContext } from 'react';

import { VrackTask } from '@ovh-ux/manager-network-common';

export type VrackTasksContext = {
  vrackTasks: VrackTask[];
};

const vrackTasksContext = createContext<VrackTasksContext | undefined>(undefined);

export default vrackTasksContext;
