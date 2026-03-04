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
  const { ipAntihack, loading: isIpAntihackLoading } = useGetIpAntihack({
    ip,
    enabled,
  });

  const { ipSpam, loading: isIpSpamLoading } = useGetIpSpam({ ip, enabled });

  const { ipMitigation, loading: isIpMitigationLoading } = useGetIpMitigation({
    ip,
    enabled,
  });

  return {
    loading: isIpAntihackLoading || isIpMitigationLoading || isIpSpamLoading,
    hasAlerts: {
      antihack: ipAntihack?.filter(
        (antihack) =>
          antihack.state === IpAntihackStateEnum.BLOCKED &&
          isSubIpBlocked(antihack.ipBlocked, subIp),
      ),
      spam: ipSpam?.filter(
        (spam) =>
          spam.state === IpSpamStateEnum.BLOCKED &&
          isSubIpBlocked(spam.ipSpamming, subIp),
      ),
      mitigation: ipMitigation?.filter(
        (mitigation) =>
          mitigation.state === IpMitigationStateEnum.OK &&
          mitigation.auto &&
          isSubIpBlocked(mitigation.ipOnMitigation, subIp),
      ),
    },
  };
};
