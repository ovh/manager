export type TVeeamBackupState = 'enabled' | 'disabled' | 'creating' | 'error';

export type TRestorePointState =
  | 'available'
  | 'mounted'
  | 'restoring'
  | 'deleted';

export type TRestorePoint = {
  id: string;
  creationDate: string;
  state: TRestorePointState;
};

export type TVeeamBackup = {
  state: TVeeamBackupState;
  scheduledTime: string | null;
  accessInfos: {
    ftp: string | null;
    nfs: string | null;
    cifs: string | null;
  };
  restorePoints: Array<TRestorePoint>;
};
