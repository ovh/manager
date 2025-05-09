export interface VrackSegmentNetworkSpec {
  vlanId: string;
  type: 'DEFAULT';
  mode: 'TAGGED';
  networks: string[];
}

export interface VrackSegment {
  id: string;
  resourceStatus: string;
  targetSpec: VrackSegmentNetworkSpec;
  currentState: VrackSegmentNetworkSpec;
  currentTasks: unknown[];
}
