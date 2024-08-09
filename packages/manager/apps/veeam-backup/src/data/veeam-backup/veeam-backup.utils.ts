import { VeeamBackupWithIam } from './vcd.type';

export const getDisplayName = (backup?: VeeamBackupWithIam) =>
  backup?.iam?.displayName || backup?.id;
