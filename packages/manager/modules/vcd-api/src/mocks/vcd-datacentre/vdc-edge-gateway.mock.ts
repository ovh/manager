import { VCDEdgeGateway } from '../../types';

export const EDGE_GATEWAY_MOCKS: VCDEdgeGateway[] = [
  {
    id: 'c96b1c7c1b910',
    targetSpec: {
      edgeGatewayName: 'EdgeGW-A',
      ipBlock: '111.111.111.111/42',
    },
    currentState: {
      edgeGatewayName: 'EdgeGW-A',
      ipBlock: '111.111.111.111/42',
    },
    currentTasks: [],
    resourceStatus: 'READY',
  },
  {
    id: 'b2d8dded34510',
    targetSpec: {
      edgeGatewayName: 'EdgeGW-B',
      ipBlock: '222.222.222.222/42',
    },
    currentState: {
      edgeGatewayName: 'EdgeGW-B',
      ipBlock: '222.222.222.222/42',
    },
    currentTasks: [],
    resourceStatus: 'CREATING',
  },
  {
    id: 'b2d8dded1c4',
    targetSpec: {
      edgeGatewayName: 'EdgeGW-C',
      ipBlock: '333.333.333.333/42',
    },
    currentState: {
      edgeGatewayName: 'EdgeGW-C',
      ipBlock: '333.333.333.333/42',
    },
    currentTasks: [],
    resourceStatus: 'DELETING',
  },
];
