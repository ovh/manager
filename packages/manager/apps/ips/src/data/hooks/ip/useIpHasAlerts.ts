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
  subIp?: string;
  enabled?: boolean;
};

const isSubIpBlocked = (ipBlocked: string, subIp: string | undefined) =>
  !subIp || ipBlocked === subIp;

export const useIpHasAlerts = ({
  ip,
  subIp,
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
      antihack: ipAntihack?.filter((antihack) =>
        antihack.state === IpAntihackStateEnum.BLOCKED
        && isSubIpBlocked(antihack.ipBlocked, subIp)),
      spam: ipSpam?.filter((spam) => spam.state === IpSpamStateEnum.BLOCKED 
        && isSubIpBlocked(spam.ipSpamming, subIp)),
      mitigation: ipMitigation?.filter(
        (mitigation) =>
          mitigation.state === IpMitigationStateEnum.OK
          && mitigation.auto && isSubIpBlocked(mitigation.ipOnMitigation, subIp)
      ),
    },
  };
};
