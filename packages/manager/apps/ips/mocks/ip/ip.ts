import { PathParams } from 'msw';
import { Handler } from '@ovh-ux/manager-core-test-utils';
import ipList from './get-ips.json';
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
};

export const getIpsMocks = ({
  nbIp = 0,
  edgeFirewallDisable,
  edgeFirewallSate = IpEdgeFirewallStateEnum.OK,
}: GetIpsMocksParams): Handler[] => [
  {
    url: '/ip/:ip/reverse',
    response: (): IpReverseType[] => {
      return [];
    },
    api: 'v6',
  },
  {
    url: '/ip/:ip/mitigation',
    response: (): IpMitigationType[] => {
      return [];
    },
    api: 'v6',
  },
  {
    url: '/ip/:ip/antihack',
    response: (): IpAntihackType[] => {
      return [];
    },
    api: 'v6',
  },
  {
    url: '/ip/:ip/spam',
    response: (): IpSpamType[] => {
      return [];
    },
    api: 'v6',
  },
  {
    url: '/ip/:ip/game',
    response: (): IpGameFirewallType[] => {
      return [];
    },
    api: 'v6',
  },
  {
    url: '/ip/:ip/firewall',
    response: (): IpEdgeFirewallType[] => {
      return [
        {
          enabled: !edgeFirewallDisable,
          ipOnFirewall: '10.0.0.1',
          state: edgeFirewallSate,
        },
      ];
    },
    api: 'v6',
  },
  {
    url: '/ip/:ip',
    response: (_: unknown, params: PathParams) => {
      return ipDetails.find(({ ip }) => ip === params.ip);
    },
    api: 'v6',
  },
  {
    url: '/ip',
    response: ipList.slice(0, nbIp),
    api: 'v6',
  },
];
