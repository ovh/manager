import { VCDIpBlock } from '../../types';

export const IP_BLOCK_MOCKS: VCDIpBlock[] = [
  {
    ipBlockID: 'c96b1c7c1b91000',
    ipBlock: '123.123.123.123/24',
    destination: {},
    resource_status: {
      status: 'AVAILABLE',
      unroutable: true,
      unroutable_reason: 'ok',
    },
  },
  {
    ipBlockID: 'b2d8dded3451000',
    ipBlock: '234.234.234.234/42',
    destination: {},
    resource_status: {
      status: 'AVAILABLE',
      unroutable: true,
      unroutable_reason: 'ok',
    },
  },
  {
    ipBlockID: 'e2e5f8d7000',
    ipBlock: '345.345.345.345/42',
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
    ipBlock: '456.456.456.456/42',
    destination: {
      edgeGatewayName: 'EdgeGW-B',
    },
    resource_status: {
      status: 'READY',
      unroutable: false,
      unroutable_reason: 'used by customer resources',
    },
  },
];
