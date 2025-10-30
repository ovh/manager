import { v2 } from '@ovh-ux/manager-core-api';
import { GetEdgeGatewayParams, VCDEdgeGateway } from '../types';
import { getVcdEdgeGatewayListRoute, getVcdEdgeGatewayRoute } from '../utils';

export const getVcdEdgeGateways = async (
  id: string,
  vdcId: string,
): Promise<VCDEdgeGateway[]> => {
  const { data } = await v2.get<VCDEdgeGateway[]>(
    getVcdEdgeGatewayListRoute(id, vdcId),
  );
  return data;
};

export const getVcdEdgeGateway = async (
  params: GetEdgeGatewayParams,
): Promise<VCDEdgeGateway> => {
  const { data } = await v2.get<VCDEdgeGateway>(getVcdEdgeGatewayRoute(params));
  return data;
};

export const deleteVcdEdgeGateway = async (
  params: GetEdgeGatewayParams,
): Promise<VCDEdgeGateway> => {
  const { data } = await v2.delete<VCDEdgeGateway>(
    getVcdEdgeGatewayRoute(params),
  );
  return data;
};
