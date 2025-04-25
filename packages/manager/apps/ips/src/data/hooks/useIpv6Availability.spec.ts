import { IpObject } from '@/types/ipObject';
import { IpTypeEnum } from '../api';
import { getUnavailableRegionList } from './useIpv6Availability';

const failoverIp: IpObject = {
  ip: '2607:5300:400:1e00::/56',
  iam: {
    id: 'id1',
    urn: 'urn:v1:eu:resource:ip:1',
  },
  rir: 'RIPE',
  type: IpTypeEnum.ADDITIONAL,
  campus: '',
  country: 'fr',
  regions: ['eu-west-rbx'],
  version: 6,
  routedTo: {
    serviceName: null,
  },
  description: '',
  bringYourOwnIp: false,
  isAdditionalIp: true,
  organisationId: '',
  canBeTerminated: true,
};

const ip: IpObject = {
  ip: '2607:5300:400:1e00::/56',
  iam: {
    id: 'id1',
    urn: 'urn:v1:eu:resource:ip:1',
  },
  rir: 'RIPE',
  type: IpTypeEnum.VRACK,
  campus: '',
  country: 'fr',
  regions: ['eu-west-rbx'],
  version: 6,
  routedTo: {
    serviceName: 'pn-00001',
  },
  description: '',
  bringYourOwnIp: false,
  isAdditionalIp: true,
  organisationId: '',
  canBeTerminated: true,
};

describe('getUnavailableRegionList', () => {
  it('disable a region if there is already 3 ipv6 block on that region', () => {
    expect(
      getUnavailableRegionList(
        [failoverIp, failoverIp, failoverIp],
        'pn-00001',
      ),
    ).toEqual([
      { region: 'eu-west-rbx', has3blocks: true, alreadyInCurrentVrack: false },
    ]);
  });

  it('doest not disable a region if there is less than 3 ipv6 block on that region', () => {
    expect(
      getUnavailableRegionList([failoverIp, failoverIp], 'pn-00001'),
    ).toEqual([]);
  });

  it('disable a region if there is already an ip block on this region for this service', () => {
    expect(getUnavailableRegionList([ip], 'pn-00001')).toEqual([
      { region: 'eu-west-rbx', has3blocks: false, alreadyInCurrentVrack: true },
    ]);
  });

  it('disable a region if there is already an ip block on this region for this service and there are 3 blocks also', () => {
    expect(
      getUnavailableRegionList([ip, failoverIp, failoverIp], 'pn-00001'),
    ).toEqual([
      { region: 'eu-west-rbx', has3blocks: true, alreadyInCurrentVrack: true },
    ]);
  });

  it('does not disable a region if there is already an ip block on this region for a different service', () => {
    expect(getUnavailableRegionList([ip], 'pn-00002')).toEqual([]);
  });
});
