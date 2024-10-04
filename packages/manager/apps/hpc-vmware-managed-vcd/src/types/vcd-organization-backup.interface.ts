import { IamObject } from '@ovh-ux/manager-react-components/src/hooks/iam';

export enum BackupResourceStatus {
  CREATING = 'CREATING',
  DISABLED = 'DISABLED',
  DISABLING = 'DISABLING',
  READY = 'READY',
  REMOVED = 'REMOVED',
  UPDATING = 'UPDATING',
}

interface IBackupOffer {
  name: string;
  quotaInTB: number;
  status: string;
  usedSpaceInGB: number;
}

interface IVcdOrganizationBackupState {
  offers: IBackupOffer[];
  region: string;
}

interface IVcdOrganizationBackupTask {
  id: string;
  link: string;
  status: string | null;
  type: string;
}

export default interface IVcdOrganizationBackup {
  id: string;
  resourceStatus: BackupResourceStatus;
  currentState: IVcdOrganizationBackupState;
  currentTasks?: IVcdOrganizationBackupTask[];
  createdAt?: string;
  updatedAt?: string;
  iam: IamObject;
}
