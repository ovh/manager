export type TaskResourceType = 'IPv4' | 'IPv6' | 'routedSubrange' | 'bridgedSubrange';

export type TaskOperationType =
  | 'removeBlockFromBridgeDomain'
  | 'updateSlaacState'
  | 'removeRoutedSubrangesFromVrack';

export type TrackedTask = {
  taskId: number;
  resourceId: string;
  onFinished: () => void;
};
