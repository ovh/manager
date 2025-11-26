import { describe, expect, it } from 'vitest';

import { VCDVrackSegment } from '@ovh-ux/manager-module-vcd-api';

import { getPublicIpBlockCount } from './datacentrePublicIpBlocksTileUtils';

const segmentsWithoutUntagged: VCDVrackSegment[] = [
  {
    id: '1',
    resourceStatus: 'READY',
    targetSpec: {
      vlanId: '10',
      type: 'DEFAULT',
      mode: 'TAGGED',
      networks: [],
    },
    currentState: {
      vlanId: '10',
      type: 'DEFAULT',
      mode: 'TAGGED',
      networks: [],
    },
    currentTasks: [],
  },
];

const segmentsWhereUntaggedHasOnlyPrivateNetworks: VCDVrackSegment[] = [
  {
    id: '1',
    resourceStatus: 'READY',
    targetSpec: {
      vlanId: '20',
      type: 'DEFAULT',
      mode: 'UNTAGGED',
      networks: ['10.0.0.0/24', '192.168.1.0/24'],
    },
    currentState: {
      vlanId: '20',
      type: 'DEFAULT',
      mode: 'UNTAGGED',
      networks: ['10.0.0.0/24', '192.168.1.0/24'],
    },
    currentTasks: [],
  },
];

const segmentWhereUntaggedHasPublicAndPrivateNetworks: VCDVrackSegment[] = [
  {
    id: '1',
    resourceStatus: 'READY',
    targetSpec: {
      vlanId: '20',
      type: 'DEFAULT',
      mode: 'UNTAGGED',
      networks: [
        '10.0.0.0/24', // private
        '172.16.0.0/16', // private
        '8.8.8.0/24', // public
        '1.1.1.0/24', // public
      ],
    },
    currentState: {
      vlanId: '20',
      type: 'DEFAULT',
      mode: 'UNTAGGED',
      networks: ['10.0.0.0/24', '172.16.0.0/16', '8.8.8.0/24', '1.1.1.0/24'],
    },
    currentTasks: [],
  },
];

const segmentsWhereUntaggedHasNoNetworks: VCDVrackSegment[] = [
  {
    id: '1',
    resourceStatus: 'READY',
    targetSpec: {
      vlanId: '20',
      type: 'DEFAULT',
      mode: 'UNTAGGED',
      networks: [],
    },
    currentState: {
      vlanId: '20',
      type: 'DEFAULT',
      mode: 'UNTAGGED',
      networks: [],
    },
    currentTasks: [],
  },
];

describe('getPublicIpBlockCount', () => {
  it('returns 0 when no UNTAGGED segment exists', () => {
    expect(getPublicIpBlockCount(segmentsWithoutUntagged)).toBe(0);
  });

  it('returns 0 when UNTAGGED segment has only private networks', () => {
    expect(getPublicIpBlockCount(segmentsWhereUntaggedHasOnlyPrivateNetworks)).toBe(0);
  });

  it('counts only public IP networks inside the UNTAGGED segment', () => {
    expect(getPublicIpBlockCount(segmentWhereUntaggedHasPublicAndPrivateNetworks)).toBe(2);
  });

  it('returns 0 when UNTAGGED segment has no networks', () => {
    expect(getPublicIpBlockCount(segmentsWhereUntaggedHasNoNetworks)).toBe(0);
  });
});
