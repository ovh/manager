// Enums
export type Performance = 'HIGHPERF' | 'STANDARD';

export type ResourceStatus = 'CREATING' | 'DELETING' | 'ERROR' | 'READY' | 'SUSPENDED' | 'UPDATING';

export type VaultBillingType = 'BUNDLE' | 'PAYGO';

export type TaskStatus = 'ERROR' | 'PENDING' | 'RUNNING' | 'SCHEDULED' | 'WAITING_USER_INPUT';

export interface CurrentState {
  azName: string;
  id: string;
  name: string;
  performance: Performance;
  resourceName: string;
  status: ResourceStatus;
  type: VaultBillingType;
  vspc: string[];
}

export interface CurrentTask {
  id: string;
  link: string;
  status: TaskStatus | null;
  type: string;
}

export interface IamResource {
  displayName: string | null;
  id: string;
  tags?: Record<string, string> | null;
  urn: string;
}

export interface TargetSpec {
  name: string;
}

export interface VaultResource {
  createdAt: string;
  currentState: CurrentState;
  currentTasks: CurrentTask[];
  iam: IamResource | null;
  id: string;
  resourceStatus: ResourceStatus;
  targetSpec: TargetSpec;
  updatedAt: string;
}
