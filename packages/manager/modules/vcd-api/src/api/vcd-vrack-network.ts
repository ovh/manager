import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { VrackSegment, VrackSegmentNetworkSpec } from '../types';
import {
  getVcdDatacentreVrackNetworkRoute,
  getVcdDatacentreVrackNetworkSegmentRoute,
} from '../utils/apiRoutes';

export const getVcdVrackNetwork = (
  organizationId: string,
  vdcId: string,
): Promise<ApiResponse<VrackSegment[]>> =>
  apiClient.v2.get(getVcdDatacentreVrackNetworkRoute(organizationId, vdcId));

export const getVcdVrackNetworkSegment = ({
  id,
  vcdId,
  vrackSegmentId,
}: {
  id: string;
  vcdId: string;
  vrackSegmentId: string;
}): Promise<ApiResponse<VrackSegment>> =>
  apiClient.v2.get(
    getVcdDatacentreVrackNetworkSegmentRoute({
      id,
      vcdId,
      vrackSegmentId,
    }),
  );

export const updateNetworkVrackSegment = ({
  id,
  vcdId,
  vrackSegmentId,
  payload,
}: {
  id: string;
  vcdId: string;
  vrackSegmentId: string;
  payload: VrackSegmentNetworkSpec;
}): Promise<ApiResponse<VrackSegment[]>> =>
  apiClient.v2.put(
    getVcdDatacentreVrackNetworkSegmentRoute({
      id,
      vcdId,
      vrackSegmentId,
    }),
    {
      data: payload,
    },
  );

export const deleteVrackSegment = ({
  id,
  vcdId,
  vrackSegmentId,
}: {
  id: string;
  vcdId: string;
  vrackSegmentId: string;
}): Promise<ApiResponse<VrackSegment[]>> =>
  apiClient.v2.delete(
    getVcdDatacentreVrackNetworkSegmentRoute({
      id,
      vcdId,
      vrackSegmentId,
    }),
  );
