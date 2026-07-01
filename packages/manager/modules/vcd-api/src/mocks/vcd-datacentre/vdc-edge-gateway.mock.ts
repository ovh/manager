import { VCDEdgeGateway } from '../../types';

export const EDGE_NAME_MOCKS = {
  edgeA: 'EdgeGW-A',
  edgeB: 'EdgeGW-B',
  edgeC: 'EdgeGW-C',
} as const;

export const EDGE_GATEWAY_MOCKS: VCDEdgeGateway[] = [
  {
    id: EDGE_NAME_MOCKS.edgeA,
    targetSpec: {
      name: EDGE_NAME_MOCKS.edgeA,
    },
    currentState: {
      deploymentMode: 'ACTIVE_STANDBY',
      idurn: '',
      name: EDGE_NAME_MOCKS.edgeA,
      providerGateway: '',
    },
    currentTasks: [],
    resourceStatus: 'READY',
  },
  {
    id: EDGE_NAME_MOCKS.edgeB,
    targetSpec: {
      name: EDGE_NAME_MOCKS.edgeB,
    },
    currentState: {
      deploymentMode: 'ACTIVE_STANDBY',
      idurn: '',
      name: EDGE_NAME_MOCKS.edgeB,
      providerGateway: '',
    },
    currentTasks: [],
    resourceStatus: 'READY',
  },
  {
    id: EDGE_NAME_MOCKS.edgeC,
    targetSpec: {
      name: EDGE_NAME_MOCKS.edgeC,
    },
    currentState: {
      deploymentMode: 'ACTIVE_STANDBY',
      idurn: '',
      name: EDGE_NAME_MOCKS.edgeC,
      providerGateway: '',
    },
    currentTasks: [],
    resourceStatus: 'READY',
  },
];
