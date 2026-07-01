import { VCDIpBlock } from '../../types';
import { EDGE_NAME_MOCKS } from '../vcd-datacentre';

export const IP_BLOCK_MOCKS: VCDIpBlock[] = [
  {
    id: 'ipblock-1',
    currentState: {
      edgeGatewayId: EDGE_NAME_MOCKS.edgeA,
      internalScope: '111.111.111.111/42',
      name: 'IP Block 1',
    },
    currentTasks: [],
    resourceStatus: 'READY',
    targetSpec: {
      edgeGatewayId: EDGE_NAME_MOCKS.edgeA,
      internalScope: '111.111.111.111/42',
      name: 'IP Block 1',
    },
  },
  {
    id: 'ipblock-2',
    currentState: {
      edgeGatewayId: EDGE_NAME_MOCKS.edgeB,
      internalScope: '222.222.222.222/42',
      name: 'IP Block 2',
    },
    currentTasks: [],
    resourceStatus: 'READY',
    targetSpec: {
      edgeGatewayId: EDGE_NAME_MOCKS.edgeB,
      internalScope: '222.222.222.222/42',
      name: 'IP Block 2',
    },
  },
  {
    id: 'ipblock-3',
    currentState: {
      edgeGatewayId: EDGE_NAME_MOCKS.edgeC,
      internalScope: '333.333.333.333/42',
      name: 'IP Block 3',
    },
    currentTasks: [],
    resourceStatus: 'READY',
    targetSpec: {
      edgeGatewayId: EDGE_NAME_MOCKS.edgeC,
      internalScope: '333.333.333.333/42',
      name: 'IP Block 3',
    },
  },
  {
    id: 'ipblock-4',
    currentState: {
      edgeGatewayId: '',
      internalScope: '444.444.444.444/24',
      name: 'IP Block 4',
    },
    currentTasks: [],
    resourceStatus: 'READY',
    targetSpec: {
      edgeGatewayId: '',
      internalScope: '444.444.444.444/24',
      name: 'IP Block 4',
    },
  },
  {
    id: 'ipblock-5',
    currentState: {
      edgeGatewayId: '',
      internalScope: '555.555.555.555/24',
      name: 'IP Block 5',
    },
    currentTasks: [],
    resourceStatus: 'READY',
    targetSpec: {
      edgeGatewayId: '',
      internalScope: '555.555.555.555/24',
      name: 'IP Block 5',
    },
  },
];
