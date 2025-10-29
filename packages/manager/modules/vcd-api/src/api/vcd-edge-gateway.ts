import { v2 } from '@ovh-ux/manager-core-api';
import { VCDEdgeGateway } from '../types';
import { getVcdEdgeGatewayListRoute } from '../utils';

export const getVcdEdgeGateways = async (
  id: string,
  vdcId: string,
): Promise<VCDEdgeGateway[]> => {
  const { data } = await v2.get(getVcdEdgeGatewayListRoute(id, vdcId));
  return data;
};
