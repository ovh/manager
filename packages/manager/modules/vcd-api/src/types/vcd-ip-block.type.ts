import { VCDEdgeGatewayState } from './vcd-edge-gateway.type';

type IpBlockStatus = 'AVAILABLE' | 'READY';

// TODO: check case for 'resource_status' & 'unroutable_reason'
export type VCDIpBlock = {
  ipBlockID: string;
  ipBlock: string;
  destination: Partial<Pick<VCDEdgeGatewayState, 'edgeGatewayName'>>;
  resource_status: {
    status: IpBlockStatus;
    unroutable: boolean;
    unroutable_reason: string;
  };
};
