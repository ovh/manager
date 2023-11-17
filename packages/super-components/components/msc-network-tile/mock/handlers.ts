import { toMswHandlers, Handler } from '../../../_common/msw-helpers';
import serverDetailsInfos from './2api/ns111111.ovh.net/server-details.json';
import technicalDetailsInfos from './2api/ns111111.ovh.net/technical-details.json';
import networkDetailsInfos from './apiV6/ns111111.ovh.net/network.json';
import networkingInfos from './apiV6/ns111111.ovh.net/networking.json';
import VrackInfos from './apiV6/ns111111.ovh.net/vrack.json';
import IpLoadbalancingList from './apiV6/ns111111.ovh.net/iploadbalancing.json';
import SecondaryDnsInfos from './apiV6/ns111111.ovh.net/secondarydnsdomain.json';
import IpsListInfos from './apiV6/ns111111.ovh.net/ips.json';
import IpFoInfos from './apiV6/ns111111.ovh.net/ipFo.json';
import IpNoFoInfos from './apiV6/ns111111.ovh.net/ipNoFo.json';
import NatIPInfos from './apiV6/ns111111.ovh.net/natIp.json';

import serverDetailsInfos2 from './2api/ns222222.ovh.net/server-details.json';
import technicalDetailsInfos2 from './2api/ns222222.ovh.net/technical-details.json';
import networkDetailsInfos2 from './apiV6/ns222222.ovh.net/network.json';
import networkingInfos2 from './apiV6/ns222222.ovh.net/networking.json';
import VrackInfos2 from './apiV6/ns222222.ovh.net/vrack.json';
import IpLoadbalancingList2 from './apiV6/ns222222.ovh.net/iploadbalancing.json';
import SecondaryDnsInfos2 from './apiV6/ns222222.ovh.net/secondarydnsdomain.json';
import IpsListInfos2 from './apiV6/ns222222.ovh.net/ips.json';
import IpNoFoInfos2 from './apiV6/ns222222.ovh.net/ipNoFo.json';

export const config: Handler[] = [
  {
    url: 'sws/dedicated/server/ns111111.ovh.net',
    response: serverDetailsInfos,
    api: 'aapi',
  },
  {
    url: 'dedicated/technical-details/ns111111.ovh.net',
    response: technicalDetailsInfos,
    api: 'aapi',
  },
  {
    url: 'dedicated/server/ns111111.ovh.net/specifications/network',
    response: networkDetailsInfos,
    api: 'v6',
  },
  {
    url: 'dedicated/server/ns111111.ovh.net/networking',
    response: networkingInfos,
    api: 'v6',
  },
  {
    url: 'dedicated/server/ns111111.ovh.net/vrack',
    response: VrackInfos,
    api: 'v6',
  },
  {
    url: 'vrack/pn-12345678/ipLoadbalancing',
    response: IpLoadbalancingList,
    api: 'v6',
  },
  {
    url: 'ipLoadbalancing/loadbalancer-0b57ab9cc613890fe53304d90f1e4dd4',
    response: NatIPInfos,
    api: 'v6',
  },
  {
    url: 'dedicated/server/ns111111.ovh.net/secondaryDnsDomains',
    response: SecondaryDnsInfos,
    api: 'v6',
  },
  {
    url: 'ip/178.33.105.54/32',
    response: IpFoInfos,
    api: 'v6',
  },
  {
    url: 'ip/51.38.62.212/32',
    response: IpNoFoInfos,
    api: 'v6',
  },
  {
    url: 'dedicated/server/ns111111.ovh.net/ips',
    response: IpsListInfos,
    api: 'v6',
  },
  {
    url: 'sws/dedicated/server/ns222222.ovh.net',
    response: serverDetailsInfos2,
    api: 'aapi',
  },
  {
    url: 'dedicated/technical-details/ns222222.ovh.net',
    response: technicalDetailsInfos2,
    api: 'aapi',
  },
  {
    url: 'dedicated/server/ns222222.ovh.net/specifications/network',
    response: networkDetailsInfos2,
    api: 'v6',
  },
  {
    url: 'dedicated/server/ns222222.ovh.net/networking',
    response: networkingInfos2,
    api: 'v6',
  },
  {
    url: 'dedicated/server/ns222222.ovh.net/vrack',
    response: VrackInfos2,
    api: 'v6',
  },
  {
    url: 'vrack/pn-5678912/ipLoadbalancing',
    response: IpLoadbalancingList2,
    api: 'v6',
  },
  {
    url: 'dedicated/server/ns222222.ovh.net/secondaryDnsDomains',
    response: SecondaryDnsInfos2,
    api: 'v6',
  },
  {
    url: 'ip/51.38.62.212/32',
    response: IpNoFoInfos2,
    api: 'v6',
  },
  {
    url: 'dedicated/server/ns222222.ovh.net/ips',
    response: IpsListInfos2,
    api: 'v6',
  },
];

export default toMswHandlers(config);
