import { Handler } from '@ovh-ux/manager-core-test-utils';
import { availableService, expiredService } from './serviceInfo';
import { VPS, VpsDatacenter } from '../src/data/api';

const vpsList: VPS[] = [
  {
    iam: {
      id: 'id-vps',
      urn: 'urn:v1:eu:resource:vps:vps-11111111.vps.ovh.ca',
    },
    name: 'vps-11111111.vps.ovh.ca',
    zone: 'Region OpenStack: os-bhs6',
    model: {
      disk: 40,
      name: 'modelName',
      offer: 'offer',
      vcore: 2,
      memory: 2048,
      version: 'version',
      datacenter: [],
      availableOptions: [],
      maximumAdditionnalIp: 16,
    },
    state: 'running',
    vcore: 2,
    keymap: null,
    cluster: '',
    offerType: 'ssd',
    displayName: 'vps-11111111.vps.ovh.ca',
    memoryLimit: 2048,
    netbootMode: 'local',
    slaMonitoring: false,
    monitoringIpBlocks: [],
  },
];

const datacenter: VpsDatacenter = {
  longName: 'Mumbai',
  name: 'YNM',
  country: 'in',
};

const orderableIpCountries = [
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
];

export type GetVpsMocksParams = {
  nbVps?: number;
  getVpsKo?: boolean;
  isVpsExpired?: boolean;
};

export const getVpsMocks = ({
  nbVps = 1,
  getVpsKo,
  isVpsExpired,
}: GetVpsMocksParams): Handler[] => [
  {
    url: '/vps/:serviceName/ipCountryAvailable',
    response: orderableIpCountries,
    api: 'v6',
  },
  {
    url: '/vps/:serviceName/datacenter',
    response: datacenter,
    api: 'v6',
  },
  {
    url: '/vps/:serviceName/serviceInfos',
    response: isVpsExpired ? expiredService : availableService,
    api: 'v6',
  },
  {
    url: '/vps',
    response: getVpsKo
      ? {
          message: 'Get VPS KO',
        }
      : vpsList.slice(0, nbVps),
    api: 'v6',
    status: getVpsKo ? 400 : 200,
  },
];
