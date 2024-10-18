import { appName } from './veeam-backup.config';

export const LEVEL2 = {
  EU: {
    config: {
      level2: '81',
    },
  },
  CA: {
    config: {
      level2: '81',
    },
  },
  US: {
    config: {
      level2: '81',
    },
  },
};
export const UNIVERSE = 'Manager';
export const SUB_UNIVERSE = 'Manager';
export const APP_NAME = appName;

export enum PageName {
  successDeleteVeeamBackup = 'delete_veeam-backup_success',
  errorDeleteVeeamBackup = 'delete_veeam-backup_error',
  successUpdateVeeamBackup = 'update_veeam-backup_success',
  errorUpdateVeeamBackup = 'update_veeam-backup_error',
}
