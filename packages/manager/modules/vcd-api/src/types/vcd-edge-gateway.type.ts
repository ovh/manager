import { Task, VCDResourceStatus } from './vcd-utility.type';

export type VCDEdgeGatewayState = {
  edgeGatewayName: string;
  ipBlock: string;
};

export type VCDEdgeGateway = {
  id: string;
  targetSpec: VCDEdgeGatewayState;
  currentState: VCDEdgeGatewayState;
  currentTasks: Task[];
  resourceStatus: VCDResourceStatus;
  updatedAt?: string;
};
