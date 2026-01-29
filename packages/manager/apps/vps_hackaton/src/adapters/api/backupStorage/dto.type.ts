export type TBackupStorageDTO = {
  quota: number;
  usage: number;
  ftpUrl: string;
  access: {
    ftp: boolean;
    nfs: boolean;
    cifs: boolean;
  };
};

export type TBackupStorageAclDTO = {
  ipBlock: string;
  ftp: boolean;
  nfs: boolean;
  cifs: boolean;
};
