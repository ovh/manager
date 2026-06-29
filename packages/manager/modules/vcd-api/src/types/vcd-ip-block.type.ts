import { Task, VCDResourceStatus } from './vcd-utility.type';

// TODO: [VCF_ADVANCED UNMOCKING] to remove: old contract code (commented out)
// type IpBlockStatus = 'AVAILABLE' | 'READY';

// export type VCDIpBlock = {
//   ipBlockID: string;
//   ipBlock: string;
//   destination: Partial<Pick<VCDEdgeGatewayState, 'edgeGatewayName'>>;
//   resource_status: {
//     status: IpBlockStatus;
//     unroutable: boolean;
//     unroutable_reason: string;
//   };
// };

type IpBlockState = {
  edgeGatewayId: string;
  internalScope: string; // Network CIDR of the IP block (also called "IP Space" in OVH terminology)
  name: string;
};

type IpBlockTask = Omit<Task, 'status'> & {
  status: 'ERROR' | 'PENDING' | 'RUNNING' | 'SCHEDULED' | 'WAITING_USER_INPUT';
};

export type VCDIpBlock = {
  currentState: IpBlockState;
  currentTasks: IpBlockTask[];
  id: string;
  resourceStatus: VCDResourceStatus | 'UNKNOWN' | 'OUT_OF_SYNC';
  targetSpec: IpBlockState;
};
