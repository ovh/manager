import {
  keepPreviousData,
  queryOptions,
  useQuery,
  UseQueryOptions,
  QueryKey,
} from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { VCDVrackSegment } from '../types';

import { getVrackSegment, getVrackSegmentList } from '../api/vcd-vrack-segment';

import {
  getVrackSegmentListQueryKey,
  getVrackSegmentQueryKey,
} from '../utils/queryKeys';

export const useVcdVrackSegmentListOptions = (id: string, vdcId: string) => {
  return queryOptions({
    queryKey: getVrackSegmentListQueryKey(id, vdcId),
    queryFn: () => getVrackSegmentList(id, vdcId),
    placeholderData: keepPreviousData,
    select: (data) => data.data,
  });
};

export const useVcdVrackSegmentsList = (
  id: string,
  vdcId: string,
  options?: Omit<
    UseQueryOptions<
      ApiResponse<VCDVrackSegment[]>,
      ApiError,
      ApiResponse<VCDVrackSegment[]>,
      QueryKey
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: getVrackSegmentListQueryKey(id, vdcId),
    queryFn: () => getVrackSegmentList(id, vdcId),
    ...options,
  });
};

export const useVcdVrackSegment = (
  id: string,
  vdcId: string,
  vrackSegmentId: string,
) => {
  return useQuery({
    queryKey: getVrackSegmentQueryKey({ id, vdcId, vrackSegmentId }),
    queryFn: () => getVrackSegment({ id, vdcId, vrackSegmentId }),
  });
};

export const useVcdVrackSegmentOptions = ({
  id,
  vdcId,
  vrackSegmentId,
}: {
  id: string;
  vdcId: string;
  vrackSegmentId: string;
}) => {
  return queryOptions({
    queryKey: getVrackSegmentQueryKey({ id, vdcId, vrackSegmentId }),
    queryFn: () => getVrackSegment({ id, vdcId, vrackSegmentId }),
    placeholderData: keepPreviousData,
    select: (data) => data.data,
  });
};
