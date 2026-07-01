import { PathParams } from 'msw';
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
      '/vmwareCloudDirector/organization/:id/virtualDataCenter/:vdcId/edgeGateway',
    response: isEdgeGatewayKO
      ? { message: 'edgeGateway error' }
      : EDGE_GATEWAY_MOCKS.slice(0, nbEdgeGateway),
    api: 'v2',
    status: isEdgeGatewayKO ? 500 : 200,
  },
  {
    url:
      '/vmwareCloudDirector/organization/:id/virtualDataCenter/:vdcId/edgeGateway/:edgeGatewayId',
    response: isEdgeGatewayKO
      ? { message: 'edgeGateway error' }
      : (_: unknown, params: PathParams) =>
          EDGE_GATEWAY_MOCKS.find((edge) => edge.id === params.edgeGatewayId),
    api: 'v2',
    status: isEdgeGatewayKO ? 500 : 200,
  },
];
