import ippadr from 'ipaddr.js';
import { PathParams } from 'msw';
import { Handler } from '@ovh-ux/manager-core-test-utils';
import ipList from './get-ips.json';
import icebergIpList from './iceberg-get-ip.json';
import icebergIpListFull from './iceberg-get-ip-full';
import ipDetails from './get-ip-details.json';
import getIpReverseForBlock from './get-ip-reverse-for-block.json';
import getIpv6ReverseForBlock from './get-ipv6-reverse-for-block.json';
import {
  getGameFirewallRuleListResponse,
  getGameFirewallRuleResponse,
  getIpGameFirewallResponse,
} from './get-ip-game-firewall';
import {
  IpAntihackType,
  IpEdgeFirewallStateEnum,
  IpEdgeFirewallType,
  IpGameFirewallStateEnum,
  IpGameFirewallType,
  IpMitigationType,
  IpReverseType,
  IpSpamType,
} from '@/data/api';

export type GetIpsMocksParams = {
  nbIp?: number;
  edgeFirewallDisable?: boolean;
  edgeFirewallSate?: IpEdgeFirewallStateEnum;
  isIpv6LimitReached?: boolean;
  getReverseApiKo?: boolean;
  postReverseApiKo?: boolean;
  gameFirewallConfig?: {
    isUpdateKo?: boolean;
    firewallModeEnabled?: boolean;
    state?: IpGameFirewallStateEnum;
  };
};

export const getIpsMocks = ({
  nbIp = 0,
  edgeFirewallDisable,
  edgeFirewallSate = IpEdgeFirewallStateEnum.OK,
  isIpv6LimitReached = false,
  getReverseApiKo = false,
  postReverseApiKo = false,
  gameFirewallConfig,
}: GetIpsMocksParams): Handler[] => [
  {
    url: '/ip/:ip/reverse/:reverseIp',
    response: (_: unknown, params: PathParams) =>
      getReverseApiKo
        ? {
            message: 'Reverse Api Error',
          }
        : {
            reverse: 'reverse.ovh.fr.',
            ipReverse: params.reverseIp,
          },
    api: 'v6',
    status: getReverseApiKo ? 400 : 200,
  },
  {
    url: '/ip/:ip/reverse',
    response: () =>
      postReverseApiKo
        ? {
            message: 'Post reverse Api Error',
          }
        : null,
    api: 'v6',
    method: 'post',
    status: postReverseApiKo ? 400 : 200,
  },
  {
    url: '/ip/:ip/reverse',
    response: (_: unknown, params: PathParams): IpReverseType[] =>
      ippadr.IPv4.isIPv4(params.ip as string)
        ? getIpReverseForBlock
        : getIpv6ReverseForBlock,
    api: 'v6',
  },
  {
    url: '/ip/:ip/mitigation',
    response: (): IpMitigationType[] => [],
    api: 'v6',
  },
  {
    url: '/ip/:ip/antihack',
    response: (): IpAntihackType[] => [],
    api: 'v6',
  },
  {
    url: '/ip/:ip/spam',
    response: (): IpSpamType[] => [],
    api: 'v6',
  },
  {
    url: '/ip/:ipGroup/game/:ip/rule/:ruleId',
    response: (_: unknown, params: PathParams) =>
      getGameFirewallRuleResponse(parseInt(params.ruleId as string, 10)),
    api: 'v6',
  },
  {
    url: '/ip/:ipGroup/game/:ip/rule',
    response: () => getGameFirewallRuleListResponse,
    api: 'v6',
  },
  {
    url: '/ip/:ipGroup/game/:ip',
    response: () =>
      gameFirewallConfig?.isUpdateKo
        ? { message: 'game firewall update KO' }
        : null,
    status: gameFirewallConfig?.isUpdateKo ? 400 : 200,
    api: 'v6',
    method: 'put',
  },
  {
    url: '/ip/:ip/game',
    response: (_: unknown, params: PathParams): IpGameFirewallType[] =>
      getIpGameFirewallResponse({
        ipOnGame: params.ip as string,
        firewallModeEnabled: gameFirewallConfig?.firewallModeEnabled,
        state: gameFirewallConfig?.state,
      }),
    api: 'v6',
  },
  {
    url: '/ip/:ip/firewall',
    response: (): IpEdgeFirewallType[] => [
      {
        enabled: !edgeFirewallDisable,
        ipOnFirewall: '10.0.0.1',
        state: edgeFirewallSate,
      },
    ],
    api: 'v6',
  },
  {
    url: '/ip/:ip',
    response: (_: Request, params: PathParams) =>
      ipDetails.find(({ ip }) => ip === params.ip),
    api: 'v6',
  },
  {
    url: '/ip',
    response: ipList.slice(0, nbIp),
    icebergResponse: () =>
      isIpv6LimitReached ? icebergIpListFull : icebergIpList,
    api: 'v6',
  },
];
