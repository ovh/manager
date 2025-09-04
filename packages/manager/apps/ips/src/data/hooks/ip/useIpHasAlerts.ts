import {
  IpAntihackStateEnum,
  IpMitigationStateEnum,
  IpSpamStateEnum,
} from '@/data/api';
import { useGetIpAntihack } from './useGetIpAntihack';
import { useGetIpMitigation } from './useGetIpMitigation';
import { useGetIpSpam } from './useGetIpSpam';

export type UseIpHasAlertsParams = {
  ip: string;
  enabled?: boolean;
};

export const useIpHasAlerts = ({
  ip,
  enabled = true,
}: UseIpHasAlertsParams) => {
  const { ipAntihack, isLoading: isIpAntihackLoading } = useGetIpAntihack({
    ip,
    enabled,
  });
  const { ipSpam, isLoading: isIpSpamLoading } = useGetIpSpam({ ip, enabled });
  const {
    ipMitigation,
    isLoading: isIpMitigationLoading,
  } = useGetIpMitigation({ ip, enabled });

  return {
    isLoading: isIpAntihackLoading && isIpMitigationLoading && isIpSpamLoading,
    hasAlerts: {
      antihack: ipAntihack?.filter(
        (antihack) => antihack.state === IpAntihackStateEnum.BLOCKED,
      ),
      spam: ipSpam?.filter((spam) => spam.state === IpSpamStateEnum.BLOCKED),
      mitigation: ipMitigation?.filter(
        (mitigation) =>
          mitigation.state === IpMitigationStateEnum.OK && mitigation.auto,
      ),
    },
  };
};
