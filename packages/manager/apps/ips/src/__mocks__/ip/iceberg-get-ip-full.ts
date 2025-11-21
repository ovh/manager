import { IpTypeEnum } from '@/data/constants';
import { IpObject } from '@/types/ipObject';

const regionList = [
  'ca-east-bhs',
  'ca-east-tor',
  'eu-central-waw',
  'eu-west-eri',
  'eu-west-gra',
  'eu-west-lim',
  'eu-west-par',
  'eu-west-rbx',
  'eu-west-sbg',
];

const getIpv6Ip = (region: string, index: number): IpObject => ({
  ip: `2607:530${index}:400:1e00::/56`,
  iam: {
    id: `id-${region}-${index}`,
    urn: 'urn:v1:eu:resource:ip:1',
  },
  rir: 'RIPE',
  type: IpTypeEnum.ADDITIONAL,
  campus: '',
  country: 'ca',
  regions: [region],
  version: 6,
  routedTo: {
    serviceName: null,
  },
  description: null,
  bringYourOwnIp: false,
  isAdditionalIp: true,
  organisationId: null,
  canBeTerminated: true,
});

export default regionList
  .map((region) => [region, region, region])
  .flatMap((region) => region.map(getIpv6Ip));
