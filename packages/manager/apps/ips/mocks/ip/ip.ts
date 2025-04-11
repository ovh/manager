import { PathParams } from 'msw';
import { Handler } from '@ovh-ux/manager-core-test-utils';
import ipList from './get-ips.json';
import icebergIpList from './iceberg-get-ip.json';
import icebergIpListFull from './iceberg-get-ip-full';
import ipDetails from './get-ip-details.json';
import {
  IpAntihackType,
  IpEdgeFirewallStateEnum,
  IpEdgeFirewallType,
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
};

export const getIpsMocks = ({
  nbIp = 0,
  edgeFirewallDisable,
  edgeFirewallSate = IpEdgeFirewallStateEnum.OK,
  isIpv6LimitReached = false,
}: GetIpsMocksParams): Handler[] => [
  {
    url: '/ip/:ip/reverse',
    response: (): IpReverseType[] => [],
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
    url: '/ip/:ip/game',
    response: (): IpGameFirewallType[] => [],
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
