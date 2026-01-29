export type TBackupStorageAccess = {
  ftp: boolean;
  nfs: boolean;
  cifs: boolean;
};

export type TBackupStorageAcl = {
  ipBlock: string;
  ftp: boolean;
  nfs: boolean;
  cifs: boolean;
};

export type TBackupStorage = {
  quota: number;
  usage: number;
  ftpUrl: string;
  access: TBackupStorageAccess;
  acls: Array<TBackupStorageAcl>;
};
