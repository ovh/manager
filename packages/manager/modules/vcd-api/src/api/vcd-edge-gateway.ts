import { v2 } from '@ovh-ux/manager-core-api';
import {
  GetEdgeGatewayParams,
  VCDEdgeGateway,
  VCDEdgeGatewayTargetSpec,
} from '../types';
import { getVcdEdgeGatewayListRoute, getVcdEdgeGatewayRoute } from '../utils';

export type AddEdgeGatewayParams = {
  id: string;
  vdcId: string;
  payload: VCDEdgeGatewayTargetSpec;
};
export type UpdateEdgeGatewayParams = AddEdgeGatewayParams & {
  edgeGatewayId: string;
};

export const createVcdEdgeGateway = async ({
  id,
  vdcId,
  payload,
}: AddEdgeGatewayParams): Promise<VCDEdgeGateway> => {
  const { data } = await v2.post<VCDEdgeGateway>(
    getVcdEdgeGatewayListRoute(id, vdcId),
    { targetSpec: payload },
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

export const updateVcdEdgeGateway = async ({
  payload,
  ...params
}: UpdateEdgeGatewayParams): Promise<VCDEdgeGateway> => {
  const { data } = await v2.put<VCDEdgeGateway>(
    getVcdEdgeGatewayRoute(params),
    { targetSpec: payload },
  );
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
