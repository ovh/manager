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

export type VeeamBackupOfferName = 'BRONZE' | 'SILVER' | 'GOLD';

export type VeeamBackupOffer = {
  name: VeeamBackupOfferName;
  quotaInTB: number;
  usedSpaceInGB: number;
  status:
    | 'READY'
    | 'CREATING'
    | 'DISABLED'
    | 'DISABLING'
    | 'REMOVED'
    | 'UPDATING';
  protectionPrimaryRegion?: string;
  protectionReplicatedRegion?: string;
};

export type VeeamBackupOfferTargetSpec = {
  name: VeeamBackupOfferName;
  quotaInTB: number;
};

export type VeeamBackup = WithIam<{
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
    offers: VeeamBackupOfferTargetSpec[];
  };
}>;
