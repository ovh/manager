export interface VCDVrackSegmentSpec {
  vlanId: string;
  type: 'DEFAULT';
  mode: 'TAGGED';
  networks: string[];
}

export interface VCDVrackSegment {
  id: string;
  resourceStatus: string;
  targetSpec: VCDVrackSegmentSpec;
  currentState: VCDVrackSegmentSpec;
  currentTasks: unknown[];
}
