export type TRestorePointDTO = {
  id: string;
  creationDate: string;
  state: string;
};

export type TVeeamBackupDTO = {
  state: string;
  scheduledTime: string | null;
  access: {
    ftp: string | null;
    nfs: string | null;
    cifs: string | null;
  };
  restorePoints: Array<TRestorePointDTO>;
};
