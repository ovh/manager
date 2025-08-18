export interface VCDVrackSegmentSpec {
  vlanId: string;
  type: 'DEFAULT' | 'MIGRATED';
  mode: 'TAGGED' | 'TRUNK' | 'UNTAGGED' | 'PUBLIC';
  networks: string[];
}

export type VrackSegmentResourceStatus =
  | 'CREATING'
  | 'DELETING'
  | 'ERROR'
  | 'READY'
  | 'SUSPENDED'
  | 'UPDATING';

export interface VCDVrackSegment {
  id: string;
  resourceStatus: VrackSegmentResourceStatus;
  targetSpec: VCDVrackSegmentSpec;
  currentState: VCDVrackSegmentSpec;
  currentTasks: unknown[];
}
