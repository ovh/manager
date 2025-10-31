import { Task, VCDResourceStatus } from './vcd-utility.type';

export type GetEdgeGatewayParams = {
  id: string;
  vdcId: string;
  edgeGatewayId: string;
};

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
