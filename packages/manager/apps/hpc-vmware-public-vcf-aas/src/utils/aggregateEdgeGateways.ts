import {
  VCDEdgeGateway,
  VCDEdgeGatewayWithIpBlock,
  VCDIpBlock,
} from '@ovh-ux/manager-module-vcd-api';

type AggregateEdgeParams = {
  edges: VCDEdgeGateway[];
  ipBlocks: VCDIpBlock[];
};

export const getEdgeGatewayAssignedIpBlock = (
  edge: VCDEdgeGateway,
  ipBlocks: VCDIpBlock[],
): VCDIpBlock | undefined => {
  return ipBlocks.find((ip) => ip.currentState.edgeGatewayId === edge.id);
};

export const aggregateEdgeGateways = ({
  edges,
  ipBlocks,
}: AggregateEdgeParams): VCDEdgeGatewayWithIpBlock[] => {
  const edgeWithIpBlocks = edges.map((edge) => {
    const ipBlock = getEdgeGatewayAssignedIpBlock(edge, ipBlocks);

    return {
      ...edge,
      ipBlock: ipBlock
        ? {
            id: ipBlock.id,
            internalScope: ipBlock.currentState.internalScope,
            name: ipBlock.currentState.name,
          }
        : undefined,
    };
  });

  return edgeWithIpBlocks;
};
