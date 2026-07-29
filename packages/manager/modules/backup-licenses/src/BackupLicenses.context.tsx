import { createContext } from 'react';

export type BackupLicensesScope = 'Unknown' | 'Enterprise' | 'Baremetal';

export interface BackupLicensesProviderProps {
  appName: string;
  scope?: BackupLicensesScope;
}

export const BackupLicensesContext = createContext<BackupLicensesProviderProps>({
  appName: 'backup-licenses',
  scope: 'Unknown',
});
