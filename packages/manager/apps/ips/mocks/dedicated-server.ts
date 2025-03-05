import { Handler } from '@ovh-ux/manager-core-test-utils';
import { PathParams } from 'msw';
import { availableService, expiredService } from './serviceInfo';
import { DedicatedServer } from '../src/data/api';

const dedicatedServerList: DedicatedServer[] = [
  {
    ip: '111.222.333.444',
    os: 'os',
    iam: {
      id: 'id-server',
      urn: 'urn:v1:eu:resource:dedicatedServer:ns1111111.ip-111-222-333.net',
      displayName: 'Dedicated Server Test',
    },
    name: 'ns1111111.ip-111-222-333.net',
    rack: 'rack',
    state: 'ok',
    bootId: 11111,
    region: 'ca-east-bhs',
    reverse: 'ns0111111.ip-111-222-333.net',
    serverId: 222222,
    linkSpeed: 1000,
    bootScript: null,
    datacenter: 'bhs8',
    monitoring: true,
    powerState: 'poweron',
    rescueMail: null,
    rootDevice: null,
    rescueSshKey: null,
    supportLevel: 'pro',
    noIntervention: false,
    commercialRange: 'commercialRange',
    professionalUse: false,
    availabilityZone: 'ca-east-bhs-a',
    newUpgradeSystem: true,
    efiBootloaderPath: null,
  },
];

export type GetDedicatedServerMocksParams = {
  nbDedicatedServers?: number;
  isDedicatedServerExpired?: boolean;
};

export const getDedicatedServerMocks = ({
  nbDedicatedServers = 1,
  isDedicatedServerExpired,
}: GetDedicatedServerMocksParams): Handler[] => [
  {
    url: '/dedicated/server/:serviceName/serviceInfos',
    response: isDedicatedServerExpired ? expiredService : availableService,
    api: 'v6',
  },
  {
    url: '/dedicated/server/:serviceName',
    response: (_: unknown, params: PathParams) =>
      dedicatedServerList.find(
        (service) => service.name === params.serviceName,
      ),
    api: 'v6',
  },
  {
    url: '/dedicated/server',
    response: dedicatedServerList.slice(0, nbDedicatedServers),
    api: 'v6',
  },
];
