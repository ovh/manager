import ippadr from 'ipaddr.js';
import { PathParams } from 'msw';
import { Handler } from '@ovh-ux/manager-core-test-utils';
import ipList from './get-ips.json';
import icebergIpList from './iceberg-get-ip.json';
import icebergIpListFull from './iceberg-get-ip-full';
import ipDetails from './get-ip-details.json';
import getIpReverseForBlock from './get-ip-reverse-for-block.json';
import getIpv6ReverseForBlock from './get-ipv6-reverse-for-block.json';
import getIpMoveResponse from './get-ip-move.json';
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
  IpMitigationStateEnum,
  IpMitigationType,
  IpReverseType,
  IpSpamType,
} from '@/data/api';
import { IpTask, IpTaskFunction, IpTaskStatus } from '@/types';

export type GetIpsMocksParams = {
  nbIp?: number;
  edgeFirewallDisable?: boolean;
  edgeFirewallSate?: IpEdgeFirewallStateEnum;
  isIpv6LimitReached?: boolean;
  getReverseApiKo?: boolean;
  postReverseApiKo?: boolean;
  getIpTaskKo?: boolean;
  hasIpTask?: boolean;
  getIpMoveKo?: boolean;
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
  getIpTaskKo = false,
  hasIpTask = false,
  getIpMoveKo = false,
  gameFirewallConfig,
}: GetIpsMocksParams): Handler[] => [
  {
    url: '/ip/:ip/move',
    response: () =>
      getIpMoveKo
        ? {
            message: 'Move IP Api Error',
          }
        : getIpMoveResponse,
    api: 'v6',
    status: getIpMoveKo ? 400 : 200,
  },
  {
    url: '/ip/:ip/move',
    response: {},
    api: 'v6',
    method: 'post',
    status: getIpMoveKo ? 400 : 200,
  },
  {
    url: '/ip/:ip/task',
    response: (): IpTask[] | { message: string } => {
      if (getIpTaskKo) {
        return { message: 'Task Api Error' };
      }
      return hasIpTask
        ? [
            {
              comment: null,
              destination: {
                serviceName: 'my-new-service',
              },
              doneDate: null,
              lastUpdate: null,
              function: IpTaskFunction.genericMoveFloatingIp,
              startDate: '2024-06-10T14:00:00+00:00',
              status: IpTaskStatus.doing,
              taskId: 1234,
            },
          ]
        : [];
    },
    api: 'v6',
    status: getIpTaskKo ? 400 : 200,
  },
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
    url: '/ip/:ipBlock/mitigation/:ip',
    response: (_: unknown, params: PathParams): IpMitigationType => ({
      permanent: false,
      ipOnMitigation: params.ip as string,
      state: IpMitigationStateEnum.OK,
      auto: true,
    }),
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
