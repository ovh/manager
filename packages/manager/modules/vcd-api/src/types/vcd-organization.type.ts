import { BillingType, ResourceStatus, Task, WithIam } from './vcd-utility.type';
import { BackupStatus } from './vcd-backup.type';

export type VCDRegion =
  | 'AP-SOUTH-MUM'
  | 'AP-SOUTHEAST-SGP'
  | 'AP-SOUTHEAST-SYD'
  | 'CA-EAST-BHS'
  | 'EU-CENTRAL-WAW'
  | 'EU-WEST-ERI'
  | 'EU-WEST-GRA'
  | 'EU-WEST-LIM'
  | 'EU-WEST-PAR'
  | 'EU-WEST-RBX'
  | 'EU-WEST-SBG'
  | 'US-EAST-VIN'
  | 'US-WEST-HIL';

export type VCDOrganizationTargetSpec = {
  fullName: string;
  description: string;
};

export type VCDOrganizationState = VCDOrganizationTargetSpec & {
  apiUrl?: string;
  billingType: BillingType;
  name: string;
  region: VCDRegion;
  spla: boolean;
  webInterfaceUrl: string;
};

export type VCDOrganization = {
  id: string;
  resourceStatus: ResourceStatus;
  currentState: VCDOrganizationState;
  targetSpec: VCDOrganizationTargetSpec;
  currentTasks?: Task[];
  updatedAt: string;
};

export type VCDOrganizationWithBackupStatus = VCDOrganization & {
  backupStatus?: BackupStatus;
};

export type VCDOrganizationWithIam = WithIam<VCDOrganization>;
