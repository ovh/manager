export interface VCDNetworkAclNetwork {
  name: string;
  network: string;
}
export interface VCDNetworkAclSpec {
  networks: VCDNetworkAclNetwork[];
}

export type VCDNetworkAclResourceStatus =
  | 'CREATING'
  | 'DELETING'
  | 'ERROR'
  | 'READY'
  | 'SUSPENDED'
  | 'UPDATING';

export type VCDNetworkTaskStatus =
  | 'ERROR'
  | 'PENDING'
  | 'RUNNING'
  | 'SCHEDULED'
  | 'WAITING_USER_INPUT';

export interface VCDNetworkAclTask {
  id: string;
  link: string;
  status: VCDNetworkTaskStatus | null;
  type: string;
}

export interface VCDNetworkAcl {
  id: string;
  resourceStatus: VCDNetworkAclResourceStatus;
  targetSpec: VCDNetworkAclSpec;
  currentState: VCDNetworkAclSpec;
  currentTasks: VCDNetworkAclTask[];
}
