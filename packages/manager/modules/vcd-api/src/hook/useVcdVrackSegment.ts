import { keepPreviousData, queryOptions } from '@tanstack/react-query';
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
