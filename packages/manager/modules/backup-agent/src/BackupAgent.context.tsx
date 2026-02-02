import { createContext } from 'react';

export type BackupAgentScope = 'Unknown' | 'Enterprise' | 'Baremetal';

export interface BackupAgentProviderProps {
  appName: string;
  scope?: BackupAgentScope;
}

export const BackupAgentContext = createContext<BackupAgentProviderProps>({
  appName: 'backup-agent',
  scope: 'Unknown',
});
