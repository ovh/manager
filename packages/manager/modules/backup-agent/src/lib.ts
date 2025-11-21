import { BackupAgentContext } from '@/BackupAgent.context';

import { BACKUP_AGENT_NAMESPACES } from './BackupAgent.translations';
import BackupAgentRoutes from './routes/routes';

export * from './types';
export * from './mocks';
export * from './data';
export * from './components';

export { BackupAgentRoutes, BackupAgentContext, BACKUP_AGENT_NAMESPACES };

export default {
  BackupAgentRoutes,
  BackupAgentContext,
  BACKUP_AGENT_NAMESPACES,
};
