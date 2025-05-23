export interface VCDVrackSegmentSpec {
  vlanId: string;
  type: 'DEFAULT' | 'MIGRATED';
  mode: 'TAGGED' | 'TRUNK' | 'UNTAGGED' | 'PUBLIC';
  networks: string[];
}

export interface VCDVrackSegment {
  id: string;
  resourceStatus: string;
  targetSpec: VCDVrackSegmentSpec;
  currentState: VCDVrackSegmentSpec;
  currentTasks: unknown[];
}
