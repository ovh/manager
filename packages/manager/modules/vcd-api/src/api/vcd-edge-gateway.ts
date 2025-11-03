import { v2 } from '@ovh-ux/manager-core-api';
import {
  GetEdgeGatewayParams,
  VCDEdgeGateway,
  VCDEdgeGatewayState,
} from '../types';
import { getVcdEdgeGatewayListRoute, getVcdEdgeGatewayRoute } from '../utils';

export type AddEdgeGatewayParams = {
  id: string;
  vdcId: string;
  payload: VCDEdgeGatewayState;
};

export const createVcdEdgeGateway = async ({
  id,
  vdcId,
  payload,
}: AddEdgeGatewayParams): Promise<VCDEdgeGateway> => {
  const { data } = await v2.put<VCDEdgeGateway>(
    getVcdEdgeGatewayListRoute(id, vdcId),
    payload,
  );
  return data;
};

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
