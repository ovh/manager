import { describe, expect, it, vi } from 'vitest';

import { DeploymentMode, TScalingState } from '@/types';

import {
  exceedsMaxNodes,
  hasInvalidScalingOrAntiAffinityConfig,
  hasMax5NodesAntiAffinity,
  isScalingValid,
  isZoneAzChecked,
} from './node-pool';

vi.mock('@/constants', () => ({
  NODE_RANGE: { MAX: 10 },
  ANTI_AFFINITY_MAX_NODES: 5,
}));

describe('exceedsMaxNodes', () => {
  it.each([
    [11, true],
    [10, false],
    [0, false],
  ])('returns %s when quantity is %i', (input, expected) => {
    expect(exceedsMaxNodes(input)).toBe(expected);
  });
});

describe('zoneAZisChecked', () => {
  it('returns true if mono deployment zone', () => {
    expect(isZoneAzChecked(null)).toBe(true);
  });

  it('returns true if availability zone is selected', () => {
    const selectedAvailabilityZones = [{ zone: 'zone-a', checked: true }];
    expect(isZoneAzChecked(selectedAvailabilityZones)).toBe(true);
  });
  it('returns false if availability zone is not selected', () => {
    const selectedAvailabilityZones = [{ zone: 'zone-a', checked: false }];

    expect(isZoneAzChecked(selectedAvailabilityZones)).toBe(false);
  });
});

describe('isScalingValid', () => {
  it.each([
    [{ isAutoscale: false, quantity: { desired: 5 } }, true],
    [{ isAutoscale: false, quantity: { desired: 11 } }, false],
    [{ isAutoscale: true, quantity: { min: 1, max: 10, desired: 5 } }, true],
    [{ isAutoscale: true, quantity: { min: 6, max: 5, desired: 5 } }, false],
    [{ isAutoscale: true, quantity: { min: 1, max: 12, desired: 5 } }, false],
    [{ isAutoscale: true, quantity: { min: 3, max: 6, desired: 2 } }, false],
  ])('returns %s for config %j', (scaling, expected) => {
    expect(isScalingValid(scaling as TScalingState)).toBe(expected);
  });
});

describe('hasMax5NodesAntiAffinity', () => {
  it.each([
    [{ antiAffinity: true, nodes: 4 }, true],
    [{ antiAffinity: true, nodes: 5 }, true],
    [{ antiAffinity: true, nodes: 6 }, false],
  ])('returns %s for state %j', ({ antiAffinity, nodes }, expected) => {
    expect(
      hasMax5NodesAntiAffinity({ antiAffinity, scaling: { quantity: { desired: nodes } } } as {
        antiAffinity: boolean;
        scaling: TScalingState;
      }),
    ).toBe(expected);
  });
});

describe('hasInvalidScalingOrAntiAffinityConfig', () => {
  it('returns true if scaling is invalid', () => {
    const nodePoolState = {
      scaling: { isAutoscale: false, quantity: { desired: 11 } } as TScalingState,
      antiAffinity: false,
      selectedAvailabilityZones: [{ zone: 'zone-1', checked: false }],
    };

    expect(hasInvalidScalingOrAntiAffinityConfig(nodePoolState)).toBe(true);
  });

  it('returns true if antiAffinity config is invalid', () => {
    const nodePoolState = {
      scaling: { isAutoscale: false, quantity: { desired: 6 } } as TScalingState,
      antiAffinity: true,
      selectedAvailabilityZones: [{ zone: 'zone', checked: false }],
    };

    expect(hasInvalidScalingOrAntiAffinityConfig(nodePoolState)).toBe(true);
  });

  it('returns false if everything is valid', () => {
    const nodePoolState = {
      scaling: { isAutoscale: false, quantity: { desired: 5 } } as TScalingState,
      antiAffinity: false,
      selectedAvailabilityZones: [{ zone: 'zone', checked: true }],
    };

    expect(hasInvalidScalingOrAntiAffinityConfig(nodePoolState)).toBe(false);
  });
  it('returns true if no checkbox is checked', () => {
    const nodePoolState = {
      scaling: { isAutoscale: false, quantity: { desired: 5 } } as TScalingState,
      antiAffinity: false,
      selectedAvailabilityZones: [{ zone: 'zone', checked: false }],
    };

    expect(hasInvalidScalingOrAntiAffinityConfig(nodePoolState)).toBe(true);
  });
});
