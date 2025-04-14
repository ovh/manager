export type TVolumeType =
  | 'classic'
  | 'classic-BETA'
  | 'high-speed'
  | 'high-speed-BETA'
  | 'high-speed-gen2'
  | string;

export type TBackupStatus =
  | 'creating'
  | 'deleting'
  | 'error'
  | 'ok'
  | 'restoring'
  | string;

export type TVolumeStatus =
  | 'attaching'
  | 'available'
  | 'awaiting-transfer'
  | 'backing-up'
  | 'creating'
  | 'deleting'
  | 'detaching'
  | 'downloading'
  | 'error'
  | 'error_backing-up'
  | 'error_deleting'
  | 'error_extending'
  | 'error_restoring'
  | 'extending'
  | 'in-use'
  | 'maintenance'
  | 'reserved'
  | 'restoring-backup'
  | 'retyping'
  | 'uploading'
  | string;

export type TBackup = {
  id: string;
  creationDate: string;
  name: string;
  size: number;
  volumeId: string;
  region: string;
  status: TBackupStatus;
};

export type TVolume = {
  id: string;
  attachedTo: string[];
  creationDate: string;
  name: string;
  description: string;
  size: number;
  status: TVolumeStatus;
  region: string;
  bootable: boolean;
  planCode: string | null;
  availabilityZone: string | null;
  type: TVolumeType;
};

export type TVolumeBackup = TBackup & {
  volume?: TVolume | null;
};
