export interface VCDNetwokAclNetwork {
  name: string;
  network: string;
}
export interface VCDNetwokAclSpec {
  networks: VCDNetwokAclNetwork[];
}

export type VCDNetwokAclRessourceStatus =
  | 'CREATING'
  | 'DELETING'
  | 'ERROR'
  | 'READY'
  | 'SUSPENDED'
  | 'UPDATING';

export type VCDNetwokTaskStatus =
  | 'ERROR'
  | 'PENDING'
  | 'RUNNING'
  | 'SCHEDULED'
  | 'WAITING_USER_INPUT';

export interface VCDNetwokAclTask {
  id: string;
  link: string;
  status: VCDNetwokTaskStatus | null;
  type: string;
}

export interface VCDNetwokAcl {
  id: string;
  resourceStatus: VCDNetwokAclRessourceStatus;
  targetSpec: VCDNetwokAclSpec;
  currentState: VCDNetwokAclSpec;
  currentTasks: VCDNetwokAclTask[];
}
