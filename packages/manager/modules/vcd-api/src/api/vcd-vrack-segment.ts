import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { VCDVrackSegment, VCDVrackSegmentSpec } from '../types';
import {
  getVdcVrackSegmentListRoute,
  getVdcVrackSegmentRoute,
} from '../utils/apiRoutes';

export const getVrackSegmentList = (
  organizationId: string,
  vdcId: string,
): Promise<ApiResponse<VCDVrackSegment[]>> =>
  apiClient.v2.get(getVdcVrackSegmentListRoute(organizationId, vdcId));

export const getVrackSegment = ({
  id,
  vdcId,
  vrackSegmentId,
}: {
  id: string;
  vdcId: string;
  vrackSegmentId: string;
}): Promise<ApiResponse<VCDVrackSegment>> =>
  apiClient.v2.get(getVdcVrackSegmentRoute({ id, vdcId, vrackSegmentId }));

export const updateVrackSegment = ({
  id,
  vdcId,
  vrackSegmentId,
  payload,
}: {
  id: string;
  vdcId: string;
  vrackSegmentId: string;
  payload: VCDVrackSegmentSpec;
}): Promise<ApiResponse<VCDVrackSegment>> =>
  apiClient.v2.put(getVdcVrackSegmentRoute({ id, vdcId, vrackSegmentId }), {
    data: payload,
  });

export const deleteVrackSegment = ({
  id,
  vdcId,
  vrackSegmentId,
}: {
  id: string;
  vdcId: string;
  vrackSegmentId: string;
}): Promise<ApiResponse<VCDVrackSegment>> =>
  apiClient.v2.delete(getVdcVrackSegmentRoute({ id, vdcId, vrackSegmentId }));
