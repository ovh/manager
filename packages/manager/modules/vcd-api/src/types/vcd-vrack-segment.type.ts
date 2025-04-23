export interface VrackSegmentNetworkSpec {
  vlanId: string;
  type: 'DEFAULT' | 'MIGRATED';
  mode: 'TAGGED' | 'TRUNK' | 'UNTAGGED' | 'PUBLIC';
  networks: string[];
}

export interface VrackSegment {
  id: string;
  resourceStatus: string;
  targetSpec: VrackSegmentNetworkSpec;
  currentState: VrackSegmentNetworkSpec;
  currentTasks: unknown[];
}
