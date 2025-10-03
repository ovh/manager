import { IpMitigationStateEnum } from '@/data/api';
import { useGetIpMitigation } from './useGetIpMitigation';

export type UseIpHasForcedMitigationsParams = {
  ip: string;
  enabled?: boolean;
};

export const useIpHasForcedMitigation = ({
  ip,
  enabled = true,
}: UseIpHasForcedMitigationsParams) => {
  const {
    ipMitigation,
    isLoading: isIpMitigationLoading,
  } = useGetIpMitigation({ ip, enabled });

  // if mitigationState is 'ok' and mitigation is auto then its "FORCED" mitigation
  return {
    isLoading: isIpMitigationLoading,
    hasForcedMitigation: ipMitigation?.some(
      (mitigation) =>
        mitigation.state === IpMitigationStateEnum.OK && mitigation.auto,
    ),
  };
};
