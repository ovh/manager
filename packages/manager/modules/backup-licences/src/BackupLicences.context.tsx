import { createContext } from 'react';

export type BackupLicencesScope = 'Unknown' | 'Enterprise' | 'Baremetal';

export interface BackupLicencesProviderProps {
  appName: string;
  scope?: BackupLicencesScope;
}

export const BackupLicencesContext = createContext<BackupLicencesProviderProps>({
  appName: 'backup-licences',
  scope: 'Unknown',
});
