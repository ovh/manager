import {
  IpAntihackStateEnum,
  IpMitigationStateEnum,
  IpSpamStateEnum,
} from '@/data/api';
import { useGetIpAntihack } from './useGetIpAntihack';
import { useGetIpMitigation } from './useGetIpMitigation';
import { useGetIpSpam } from './useGetIpSpam';

export type UseIpHasAlertsParams = {
  ipGroup: string;
};

export const useIpHasAlerts = ({ ipGroup }: UseIpHasAlertsParams) => {
  const { ipAntihack, isLoading: isIpAntihackLoading } = useGetIpAntihack({
    ipGroup,
  });
  const { ipSpam, isLoading: isIpSpamLoading } = useGetIpSpam({ ipGroup });
  const {
    ipMitigation,
    isLoading: isIpMitigationLoading,
  } = useGetIpMitigation({ ipGroup });

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
