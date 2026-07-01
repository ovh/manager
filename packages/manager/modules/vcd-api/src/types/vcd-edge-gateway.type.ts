import { VCFAdvancedResourceStatus, VCFAdvancedTask } from './vcd-utility.type';

export type GetEdgeGatewayParams = {
  id: string;
  vdcId: string;
  edgeGatewayId: string;
};

export type VCDEdgeGatewayTargetSpec = {
  name: string;
};

export type VCDEdgeGateway = {
  id: string;
  targetSpec: VCDEdgeGatewayTargetSpec;
  currentState: {
    deploymentMode: 'ACTIVE_STANDBY' | 'DISTRIBUTED_ONLY';
    idurn: string;
    name: string;
    providerGateway: string;
  };
  currentTasks: VCFAdvancedTask[];
  resourceStatus: VCFAdvancedResourceStatus;
};

export type VCDEdgeGatewayWithIpBlock = VCDEdgeGateway & {
  ipBlock?: {
    id: string;
    internalScope: string;
    name: string;
  };
};
