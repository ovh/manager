import { describe, expect, it, vi } from 'vitest';

import { DeploymentMode, NodePoolState } from '@/types';

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
    expect(isZoneAzChecked(DeploymentMode.MONO_ZONE, {} as NodePoolState)).toBe(true);
  });

  it('returns true if availability zone is selected', () => {
    const nodePoolState = {
      selectedAvailabilityZones: [{ zone: 'zone-a', checked: true }],
    } as NodePoolState;
    expect(isZoneAzChecked(DeploymentMode.MULTI_ZONES, nodePoolState)).toBe(true);
  });
  it('returns false if availability zone is not selected', () => {
    const nodePoolState = {
      selectedAvailabilityZones: [{ zone: 'zone-a', checked: false }],
    } as NodePoolState;

    expect(isZoneAzChecked(DeploymentMode.MULTI_ZONES, nodePoolState)).toBe(false);
  });

  it('returns false otherwise', () => {
    const nodePoolState = {} as NodePoolState;
    expect(isZoneAzChecked(DeploymentMode.MULTI_ZONES, nodePoolState)).toBe(false);
  });
});

describe('isScalingValid', () => {
  it('returns true if scaling is undefined', () => {
    expect(isScalingValid({} as NodePoolState)).toBe(true);
  });

  it.each([
    [{ isAutoscale: false, quantity: { desired: 5 } }, true],
    [{ isAutoscale: false, quantity: { desired: 11 } }, false],
    [{ isAutoscale: true, quantity: { min: 1, max: 10, desired: 5 } }, true],
    [{ isAutoscale: true, quantity: { min: 6, max: 5, desired: 5 } }, false],
    [{ isAutoscale: true, quantity: { min: 1, max: 12, desired: 5 } }, false],
    [{ isAutoscale: true, quantity: { min: 3, max: 6, desired: 2 } }, false],
  ])('returns %s for config %j', (scaling, expected) => {
    const nodePoolState = { scaling } as NodePoolState;
    expect(isScalingValid(nodePoolState)).toBe(expected);
  });
});

describe('hasMax5NodesAntiAffinity', () => {
  it.each([
    [{ antiAffinity: false }, true],
    [{ antiAffinity: true, scaling: { quantity: { desired: 4 } } }, true],
    [{ antiAffinity: true, scaling: { quantity: { desired: 5 } } }, true],
    [{ antiAffinity: true, scaling: { quantity: { desired: 6 } } }, false],
    [{ antiAffinity: true }, false],
  ])('returns %s for state %j', (state, expected) => {
    expect(hasMax5NodesAntiAffinity(state as NodePoolState)).toBe(expected);
  });
});

describe('hasInvalidScalingOrAntiAffinityConfig', () => {
  it('returns true if scaling is invalid', () => {
    const nodePoolState = {
      scaling: { isAutoscale: false, quantity: { desired: 11 } },
      antiAffinity: false,
      selectedAvailabilityZones: [{ zone: 'zone-1', checked: false }],
    } as NodePoolState;

    expect(hasInvalidScalingOrAntiAffinityConfig(DeploymentMode.MULTI_ZONES, nodePoolState)).toBe(
      true,
    );
  });

  it('returns true if antiAffinity config is invalid', () => {
    const nodePoolState = {
      scaling: { isAutoscale: false, quantity: { desired: 6 } },
      antiAffinity: true,
      selectedAvailabilityZones: [{ zone: 'zone', checked: false }],
    } as NodePoolState;

    expect(hasInvalidScalingOrAntiAffinityConfig(DeploymentMode.MULTI_ZONES, nodePoolState)).toBe(
      true,
    );
  });

  it('returns true if zone is not selected and not mono', () => {
    const nodePoolState = {
      scaling: { isAutoscale: false, quantity: { desired: 5 } },
      antiAffinity: false,
      selectedAvailabilityZones: undefined,
    } as NodePoolState;

    expect(hasInvalidScalingOrAntiAffinityConfig(DeploymentMode.MULTI_ZONES, nodePoolState)).toBe(
      true,
    );
  });

  it('returns false if everything is valid', () => {
    const nodePoolState = {
      scaling: { isAutoscale: false, quantity: { desired: 5 } },
      antiAffinity: false,
      selectedAvailabilityZones: [{ zone: 'zone', checked: true }],
    } as NodePoolState;

    expect(hasInvalidScalingOrAntiAffinityConfig(DeploymentMode.MULTI_ZONES, nodePoolState)).toBe(
      false,
    );
  });
  it('returns false if no checkbox is checked', () => {
    const nodePoolState = {
      scaling: { isAutoscale: false, quantity: { desired: 5 } },
      antiAffinity: false,
      selectedAvailabilityZones: [{ zone: 'zone', checked: false }],
    } as NodePoolState;

    expect(hasInvalidScalingOrAntiAffinityConfig(DeploymentMode.MULTI_ZONES, nodePoolState)).toBe(
      true,
    );
  });
});
