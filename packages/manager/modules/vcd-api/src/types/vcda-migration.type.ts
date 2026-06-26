export type VcdaResourceStatus =
  | 'CREATING'
  | 'READY'
  | 'UPDATING'
  | 'DELETING'
  | 'SUSPENDED'
  | 'ERROR'
  | 'OUT_OF_SYNC'
  | 'UNKNOWN';

export interface PublicCurrentTask {
  id: string;
  status: string;
  type?: string;
}

export interface PublicVcdaCurrentState {
  organizationId: string;
  migrationCloudUrl?: string;
  ips?: string[];
  azName?: string;
  id?: string;
}

export interface PublicVcdaTargetSpec {
  ips: string[];
}

export interface PublicVcda {
  id: string;
  resourceStatus: VcdaResourceStatus;
  currentState: PublicVcdaCurrentState;
  currentTasks?: PublicCurrentTask[] | null;
  targetSpec: PublicVcdaTargetSpec;
  createdAt: string;
  updatedAt: string;
}

export interface VcdaWhitelistEntry {
  ip: string;
}

export type VcdaTileStatus =
  | { kind: 'inactive' }
  | { kind: 'provisioning' }
  | { kind: 'deleting' }
  | { kind: 'active'; resourceStatus: VcdaResourceStatus };

export const matchesVcdaOrg = (
  organizationId: string | undefined,
  routeOrgId: string,
): boolean =>
  !!organizationId &&
  (organizationId === routeOrgId || routeOrgId.endsWith(`-${organizationId}`));
