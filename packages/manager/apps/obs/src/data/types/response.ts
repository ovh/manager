export interface ObservabilityTask {
  id: string;
  link: string;
  status:
    | 'ERROR'
    | 'PENDING'
    | 'RUNNING'
    | 'SCHEDULED'
    | 'WAITING_USER_INPUT'
    | null;
  type: string;
}

export interface ObservabilityIAM {
  id: string;
  displayName?: string | null;
  urn: string;
  tags?: Record<string, string> | null;
}

export interface ObservabilityState {
  displayName?: string | null;
  link: string;
  state: 'ENABLED' | 'DISABLED';
}

export interface ObservabilityTargetSpec {
  displayName: string;
}

export interface ObservabilityResource {
  checksum: string;
  createdAt: string;
  updatedAt?: string | null;
  currentState: ObservabilityState;
  currentTasks: ObservabilityTask[];
  id: string;
  resourceStatus:
    | 'CREATING'
    | 'DELETING'
    | 'ERROR'
    | 'READY'
    | 'SUSPENDED'
    | 'UPDATING';
  iam?: ObservabilityIAM | null;
  targetSpec?: ObservabilityTargetSpec | null;
}
