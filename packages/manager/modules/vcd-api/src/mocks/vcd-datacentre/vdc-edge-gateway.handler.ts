import { Handler } from '@ovh-ux/manager-core-test-utils';
import { EDGE_GATEWAY_MOCKS } from './vdc-edge-gateway.mock';

export type GetEdgeGatewayMocksParams = {
  isEdgeGatewayKO?: boolean;
  nbEdgeGateway?: number;
};

export const getEdgeGatewayMocks = ({
  isEdgeGatewayKO,
  nbEdgeGateway = Number.POSITIVE_INFINITY,
}: GetEdgeGatewayMocksParams): Handler[] => [
  {
    url:
      '/vmwareCloudDirector/organization/:id/virtualDataCenter/:id/edgeGateway',
    response: isEdgeGatewayKO
      ? { message: 'edgeGateway error' }
      : EDGE_GATEWAY_MOCKS.slice(0, nbEdgeGateway),
    api: 'v2',
    status: isEdgeGatewayKO ? 500 : 200,
  },
];
