import { Handler } from '@ovh-ux/manager-core-test-utils';
import { PathParams } from 'msw';
import { availableService, expiredService } from './serviceInfo';
import { DedicatedServer } from '../src/data/api';

export const dedicatedServerMockList: DedicatedServer[] = [
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
  isDedicatedServerCannotOrderIp?: boolean;
};

export const getDedicatedServerMocks = ({
  nbDedicatedServers = 1,
  isDedicatedServerExpired,
  isDedicatedServerCannotOrderIp,
}: GetDedicatedServerMocksParams): Handler[] => [
  {
    url: '/dedicated/server/:serviceName/ipCountryAvailable',
    response: [
      'fr',
      'de',
      'pl',
      'es',
      'it',
      'uk',
      'pt',
      'cz',
      'fi',
      'lt',
      'be',
      'nl',
      'ie',
      'ca',
    ],
    api: 'v6',
  },
  {
    url: '/dedicated/server/:serviceName/orderable/ip',
    response: isDedicatedServerCannotOrderIp
      ? { ipv6: [], ipv4: [] }
      : {
          ipv6: [],
          ipv4: [
            {
              ipNumber: 256,
              type: 'failover',
              included: true,
              optionRequired: null,
              number: 64,
              blockSizes: [1, 4, 8, 16, 32, 64, 128, 256],
            },
            {
              optionRequired: null,
              included: false,
              number: 5,
              blockSizes: [1],
              type: 'unshielded',
              ipNumber: 5,
            },
          ],
        },
    api: 'v6',
  },
  {
    url: '/dedicated/server/:serviceName/serviceInfos',
    response: isDedicatedServerExpired ? expiredService : availableService,
    api: 'v6',
  },
  {
    url: '/dedicated/server/:serviceName',
    response: (_: unknown, params: PathParams) =>
      dedicatedServerMockList.find(
        (service) => service.name === params.serviceName,
      ),
    api: 'v6',
  },
  {
    url: '/dedicated/server',
    response: dedicatedServerMockList.slice(0, nbDedicatedServers),
    api: 'v6',
  },
  {
    url: '/dedicated/server/:serviceName/task',
    response: [],
    api: 'v6',
  },
];
