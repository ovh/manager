export type Handler<T = any> = {
  url: string;
  response?: T;
  headers?: HeadersInit;
  statusText?: string;
  type?: ResponseType;
  responseText?: string;
  delay?: number;
  method?:
    | 'get'
    | 'post'
    | 'put'
    | 'delete'
    | 'all'
    | 'head'
    | 'options'
    | 'patch';
  status?: number;
  api?: 'v2' | 'v6' | 'aapi' | 'ws';
  baseUrl?: string;
  disabled?: boolean;
  once?: boolean;
};

export type IamData = {
  displayName?: string;
  id: string;
  urn: string;
};

export type AvailabilityZone =
  | 'ca-east-bhs-a'
  | 'eu-central-waw-a'
  | 'eu-west-eri-a'
  | 'eu-west-lim-a'
  | 'eu-west-rbx-a'
  | 'eu-west-sbg-a';

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

export type ResourceStatus =
  | 'READY'
  | 'CREATING'
  | 'DISABLED'
  | 'DISABLING'
  | 'REMOVED'
  | 'UPDATING';

export type Task = {
  id: string;
  link: string;
  status: 'ERROR' | 'PENDING' | 'RUNNING' | 'SCHEDULED' | null;
  type: string;
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

export type VeeamBackupWithIam = VeeamBackup & { iam: IamData };

export enum BackupStatus {
  active = 'active',
  none = 'none',
  error = 'error',
}

export type VCDOrganization = {
  id: string;
  resourceStatus: ResourceStatus;
  updatedAt: string;
  currentState: {
    apiUrl: string;
    billingType: 'DEMO' | 'MONTHLY';
    description: string;
    fullName: string;
    name: string;
    region: VCDRegion;
    spla: boolean;
    webInterfaceUrl: string;
  };
  targetSpec: {
    description: string;
    fullName: string;
  };
  currentTasks: Task[];
};

export type VCDOrganizationWithBackupStatus = VCDOrganization & {
  backupStatus?: BackupStatus;
};

export type VCDOrganizationWithIam = VCDOrganization & { iam: IamData };
