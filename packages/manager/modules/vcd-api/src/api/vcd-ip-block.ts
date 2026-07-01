import { v2 } from '@ovh-ux/manager-core-api';
import { getVcdIpBlockListRoute, getVcdIpBlockRoute } from '../utils';
import { VCDIpBlock, VCDIpBlockState } from '../types';

type IpBlockRouteParams = {
  id: string;
  ipBlockId: string;
};
type AssignIpBlock = IpBlockRouteParams & {
  payload: Pick<VCDIpBlockState, 'name' | 'edgeGatewayId'>;
};
type UnassignIpBlock = IpBlockRouteParams & {
  payload: Pick<VCDIpBlockState, 'name'> & { edgeGatewayId: null };
};

export const getVcdIpBlocks = async (id: string): Promise<VCDIpBlock[]> => {
  const { data } = await v2.get<VCDIpBlock[]>(getVcdIpBlockListRoute(id));
  return data;
};

const updateIpBlock = async ({
  id,
  ipBlockId,
  payload,
}: AssignIpBlock | UnassignIpBlock): Promise<VCDIpBlock> => {
  const { data } = await v2.put<VCDIpBlock>(getVcdIpBlockRoute(id, ipBlockId), {
    targetSpec: payload,
  });
  return data;
};

export const assignIpBlock = (params: AssignIpBlock): Promise<VCDIpBlock> =>
  updateIpBlock(params);

export const unassignIpBlock = (params: UnassignIpBlock): Promise<VCDIpBlock> =>
  updateIpBlock(params);
