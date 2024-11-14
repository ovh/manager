import { ResourceStatus, WithIam } from './vcd-utility.type';

export type AvailabilityZone =
  | 'ca-east-bhs-a'
  | 'eu-central-waw-a'
  | 'eu-west-eri-a'
  | 'eu-west-lim-a'
  | 'eu-west-rbx-a'
  | 'eu-west-sbg-a';

export enum BackupStatus {
  active = 'active',
  none = 'none',
  error = 'error',
}

export type VeeamBackupOffer = {
  name: 'BRONZE' | 'SILVER' | 'GOLD';
  quotaInTB: number;
  usedSpaceInGB: number;
  status:
    | 'READY'
    | 'CREATING'
    | 'DISABLED'
    | 'DISABLING'
    | 'REMOVED'
    | 'UPDATING';
};

export type VeeamBackup = {
  id: string;
  currentState: {
    vms?: number;
    offers: VeeamBackupOffer[];
    azName: AvailabilityZone;
  };
  updatedAt: string;
  createdAt: string;
  resourceStatus: ResourceStatus;
  targetSpec: {
    offers: Omit<VeeamBackupOffer, 'usedSpaceInGB'>[];
  };
};

export type VeeamBackupWithIam = WithIam<VeeamBackup>;
