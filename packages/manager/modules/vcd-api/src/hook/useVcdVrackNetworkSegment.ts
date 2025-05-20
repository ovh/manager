import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { getVcdVrackNetworkSegment } from '../api/vcd-vrack-network';
import { vdcNetworkVrackSegmentKey } from '../utils/queryKeys';

export const useVcdVrackNetworkSegmentOptions = ({
  id,
  vcdId,
  vrackSegmentId,
}: {
  id: string;
  vcdId: string;
  vrackSegmentId: string;
}) => {
  return queryOptions({
    queryKey: vdcNetworkVrackSegmentKey({ id, vcdId, vrackSegmentId }),
    queryFn: () => getVcdVrackNetworkSegment({ id, vcdId, vrackSegmentId }),
    placeholderData: keepPreviousData,
    select: (data) => data.data,
  });
};
