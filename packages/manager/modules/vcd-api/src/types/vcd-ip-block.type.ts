import { VCFAdvancedResourceStatus, VCFAdvancedTask } from './vcd-utility.type';

export type VCDIpBlockState = {
  edgeGatewayId: string;
  internalScope: string; // Network CIDR of the IP block (also called "IP Space" in OVH terminology)
  name: string;
};

export type VCDIpBlock = {
  currentState: VCDIpBlockState;
  currentTasks: VCFAdvancedTask[];
  id: string;
  resourceStatus: VCFAdvancedResourceStatus;
  targetSpec: VCDIpBlockState;
};
