export type TaskResourceType = 'IPv4' | 'IPv6' | 'routedSubrange' | 'bridgedSubrange';

export type TaskOperationType =
  | 'addBlockToBridgeDomain'
  | 'addBlockV6ToBridgeDomain'
  | 'removeBlockFromBridgeDomain'
  | 'removeBlockV6FromBridgeDomain'
  | 'updateSlaacState'
  | 'removeRoutedSubrangesFromVrack';

export type TrackedTask = {
  taskId: number;
  resourceId: string;
  region?: string;
  operationType?: TaskOperationType;
  onFinished: () => void;
};
