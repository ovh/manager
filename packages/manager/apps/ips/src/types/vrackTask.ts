export enum VrackTaskStatus {
  init = 'init',
  todo = 'todo',
  doing = 'doing',
  cancelled = 'cancelled',
  done = 'done',
}

export enum VrackTaskFunction {
  addBlockToBridgeDomain = 'addBlockToBridgeDomain',
  removeBlockFromBridgeDomain = 'removeBlockFromBridgeDomain',
}

export type VrackTask = {
  function: VrackTaskFunction;
  id: number;
  lastUpdate: string | null;
  orderId: number | null;
  serviceName: string | null;
  status: VrackTaskStatus;
  targetDomain: string | null;
  todoDate: string | null;
};
