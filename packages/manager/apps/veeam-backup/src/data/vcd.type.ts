export type IamData = {
  displayName?: string;
  id: string;
  urn: string;
};

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
    offers: VeeamBackupOffer[];
    region: VCDRegion;
  };
  updatedAt: string;
  createdAt: string;
  resourceStatus: ResourceStatus;
  targetSpec: {
    offers: Omit<VeeamBackupOffer, 'usedSpaceInGB'>[];
  };
};

export type VeeamBackupWithIam = VeeamBackup & { iam: IamData };

export type VCDLocation = {
  location: string;
  region: VCDRegion;
};

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

export type VCDOrganizationWithIam = VCDOrganization & { iam: IamData };
