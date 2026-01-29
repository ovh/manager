export type TVpsOptionStatus = 'enabled' | 'disabled' | 'pending' | 'error';

export type TVpsOptions = {
  snapshot: TVpsOptionStatus;
  veeam: TVpsOptionStatus;
  backupStorage: TVpsOptionStatus;
  additionalDisk: TVpsOptionStatus;
};
