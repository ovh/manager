import { VCDIpBlock } from '../../types';

export const IP_BLOCK_MOCKS: VCDIpBlock[] = [
  {
    ipBlockID: 'c96b1c7c1b91000',
    ipBlock: '444.444.444.444/24',
    destination: {},
    resource_status: {
      status: 'AVAILABLE',
      unroutable: true,
      unroutable_reason: 'ok',
    },
  },
  {
    ipBlockID: 'b2d8dded3451000',
    ipBlock: '555.555.555.555/42',
    destination: {},
    resource_status: {
      status: 'AVAILABLE',
      unroutable: true,
      unroutable_reason: 'ok',
    },
  },
  {
    ipBlockID: 'e2e5f8d7000',
    ipBlock: '111.111.111.111/42',
    destination: {
      edgeGatewayName: 'EdgeGW-A',
    },
    resource_status: {
      status: 'READY',
      unroutable: false,
      unroutable_reason: 'used by customer resources',
    },
  },
  {
    ipBlockID: 'b2d8dded1c4000',
    ipBlock: '222.222.222.222/42',
    destination: {
      edgeGatewayName: 'EdgeGW-B',
    },
    resource_status: {
      status: 'READY',
      unroutable: false,
      unroutable_reason: 'used by customer resources',
    },
  },
  {
    ipBlockID: 'a1f4c9b2e83000',
    ipBlock: '333.333.333.333/42',
    destination: {
      edgeGatewayName: 'EdgeGW-C',
    },
    resource_status: {
      status: 'READY',
      unroutable: false,
      unroutable_reason: 'used by customer resources',
    },
  },
];
